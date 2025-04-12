import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { io } from "socket.io-client";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface Profile {
  name?: string;
  avatarUrl?: string;
}

type UserRole = "user" | "admin";

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  whatsapp: string;
  address: Address;
  organizationName?: string;
  gstNumber?: string;
  role: UserRole;
  createdAt?: Date;
  balance?: number;
  profile?: Profile;
  isActive?: boolean;
}

interface ITransaction {
  transactionId: string;
  user: string;
  serviceMongoID?: string;
  type: string;
  amount: number;
  description: string;
  createdAt: Date;
}

const AppContext = createContext<any>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [payment, setPayment] = useState<any>([]);
  const [services, setServices] = useState<any>([]);
  const [requests, setRequests] = useState();
  const [userRequests, setUserRequests] = useState();
  const [showRebuildDialog, setShowRebuildDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [handleRebuildRequest, setHandleRebuildRequest] = useState(
    () => () => {}
  );
  const [dialogInfo, setDialogInfo] = useState({
    title: "",
    message: "",
    onclick: "",
  });

  const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getuserinfo", {
          withCredentials: true,
        });
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const FetchData = async () => {
      try {
        const response = await axios.get("/api/user/transactions", {
          withCredentials: true,
          signal: signal,
        });
        if (response?.data) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.log("error getting info");
      }
      try {
        const response = await axios.get("/api/user/paymentHistory", {
          withCredentials: true,
          signal: signal,
        });
        if (response?.data) {
          // console.log(response.data)
          setPayment(response.data);
        }
      } catch (error) {
        console.log("error getting info");
      }
      try {
        const notificationResponse = await axios.get(
          "/api/user/notifications",
          {
            withCredentials: true,
            signal: signal,
          }
        );
        if (notificationResponse?.data) {
          setNotifications(notificationResponse.data);
        }
      } catch (error) {
        console.log("error getting info");
      }
    };
    if (
      (transactions.length === 0 ||
        payment.length === 0 ||
        notifications?.length === 0) &&
      user
    ) {
      FetchData();
    }
    return () => {
      abortController.abort();
    };
  }, [user]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/api/user/services", {
          withCredentials: true,
        });
        if (res?.data) {
          setServices(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (services?.length === 0) {
      fetchServices();
    }
  }, []);

  useEffect(() => {
    if (!user || !user._id || !socket) return;
    socket.emit("joinUserRoom", user._id);

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };
    const handleNotificationsUpdated = () => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          seen: true,
        }))
      );
    };

    socket.on("notification", handleNotification);
    socket.on("notificationsUpdated", handleNotificationsUpdated);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user, socket]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setPayment([]);
      setServices([]);
      setRequests(undefined);
      setNotifications([]);
    }
  }, [user]);

  const getDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generatePDF = async (payment: any) => {
    try {
      // await uploadToExcel();
      const doc = new jsPDF();
      const imgSrc = "./logo.jpeg";
      const paidSrc = "./paid.png";

      doc.addImage(imgSrc, "JPEG", 15, 10, 72, 30);
      doc.addImage(paidSrc, "PNG", 160, 0, 50, 37.5);

      const x = 20;
      doc.setFont("times-new-roman");
      doc.setFontSize(14);
      doc.text(
        user?.organizationName ? `Company: ${user?.organizationName}` : "",
        96,
        15 + x
      );
      doc.setFontSize(8);
      doc.text(user?.gstNumber ? `GSTIN: ${user?.gstNumber}` : "", 159, 25 + x);
      doc.setFillColor(220, 220, 220);
      doc.rect(15, 30 + x, 180, 25, "F");
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(13);
      doc.setFont("times-new-roman", "bold");
      doc.text(`Invoice #${payment?.invoiceId}`, 16, 35 + x);
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Date: ${getDate(payment?.createdAt)}`, 16, 45 + x);
      doc.text(`Due Date: ${getDate(new Date(Date.now()))}`, 16, 50 + x);

      // Client information
      doc.setFontSize(11);
      doc.setFont("times-new-roman", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text("Invoiced To:", 16, 65 + x);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`${user?.firstName} ${user?.lastName}`, 16, 70 + x);
      doc.text(
        `${user?.address?.street}, ${user?.address?.city}, ${user?.address?.state},`,
        16,
        80 + x
      );
      doc.text(
        `${user?.address?.country}, Postal:${user?.address?.pincode}`,
        16,
        84 + x
      );

      // Items Table
      doc.autoTable({
        startY: 90 + x,
        head: [["Description", "Rate", "Quantity", "Subtotal"]],
        body: [
          [
            `NetCoin Package Purchased for\nNC: ${payment?.Price}`,
            `Rs. ${payment?.Price}`,
            "1",
            `Rs. ${payment?.Price}`,
          ],
        ],
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
        },
        tableWidth: 180,
      });

      const tableBottomY = doc.autoTable.previous.finalY + 10;

      doc.setFontSize(9);
      doc.setFillColor(220, 220, 220);
      doc.rect(14, tableBottomY - 5, 135, 7, "F");
      doc.text("Discount", 135, tableBottomY);
      doc.setFillColor(220, 220, 220);
      doc.rect(150, tableBottomY - 5, 44, 7, "F");
      doc.text(`Rs. 0 INR`, 155, tableBottomY);

      doc.setFillColor(220, 220, 220);
      doc.rect(14, tableBottomY + 3, 135, 7, "F");
      doc.text("Sub Total", 134, tableBottomY + 8);
      doc.setFillColor(220, 220, 220);
      doc.rect(150, tableBottomY + 3, 44, 7, "F");
      doc.text(
        `Rs. ${(payment?.Price / 1.18).toFixed(2)} INR`,
        155,
        tableBottomY + 8
      );

      doc.setFillColor(220, 220, 220);
      doc.rect(14, tableBottomY + 11, 135, 7, "F");

      if (user?.address?.state === "UP") {
        doc.text("9.00% CGST + 9.00% SGST/ TAX", 99, tableBottomY + 16);
      } else {
        doc.text("18.00% GST / TAX", 121, tableBottomY + 16);
      }

      doc.setFillColor(220, 220, 220);
      doc.rect(150, tableBottomY + 11, 44, 7, "F");
      doc.text(
        `Rs. ${(payment?.Price - payment?.Price / 1.18).toFixed(2)} INR`,
        155,
        tableBottomY + 16
      );

      doc.setFont("helvetica", "bold");
      doc.setFillColor(220, 220, 220);
      doc.rect(14, tableBottomY + 19, 135, 7, "F");
      doc.text("Total", 140, tableBottomY + 24);
      doc.setFillColor(220, 220, 220);
      doc.rect(150, tableBottomY + 19, 44, 7, "F");
      doc.text(`Rs. ${payment?.Price} INR`, 155, tableBottomY + 24);

      doc.setFontSize(12);
      doc.setFont("times-new-roman", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text("Transactions", 16, tableBottomY + 45);

      doc.setFont("helvetica", "normal");

      // Transactions table
      doc.autoTable({
        startY: tableBottomY + 50,
        head: [["Transaction Date", "Gateway", "Transaction ID", "Amount"]],
        body: [
          [
            getDate(payment?.createdAt),
            "UPI (India)",
            payment?.transactionID,
            `Rs. ${payment?.Price} INR`,
          ],
        ],
        columnStyles: {
          0: { cellWidth: 58, valign: "middle" },
          1: { cellWidth: 30, align: "center", valign: "middle" },
          2: { cellWidth: 50, align: "center", valign: "middle" },
          3: { cellWidth: 40, align: "right", valign: "middle" },
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
        },
        tableWidth: 180,
      });

      const transactionTableY = doc.autoTable.previous.finalY;

      // Balance
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(220, 220, 220);
      doc.rect(14, transactionTableY, 135, 7, "F");
      doc.text("Balance", 134, transactionTableY + 5);
      doc.setFillColor(220, 220, 220);
      doc.rect(150, transactionTableY, 44, 7, "F");

      const totalPaid = payment?.Price;

      doc.text(`Rs. ${totalPaid} INR`, 155, transactionTableY + 5);

      doc.setFont("helvetica", "normal");

      // PDF Generation Date
      doc.setFontSize(8);
      doc.text(
        `PDF Generated on ${getDate(new Date(Date.now()))}`,
        78,
        transactionTableY + 30
      );

      // Save the PDF
      doc.save(`Invoice-${payment?.transactionID}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        transactions,
        setTransactions,
        payment,
        setPayment,
        getDate,
        generatePDF,
        services,
        setServices,
        requests,
        setRequests,
        showRebuildDialog,
        setShowRebuildDialog,
        handleRebuildRequest,
        setHandleRebuildRequest,
        dialogInfo,
        setDialogInfo,
        notifications,
        setNotifications,
        socket,
        userRequests,
        setUserRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      context.setUser(null);
      toast({
        title: "Logout successful!",
        description: "You have successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed!",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return { ...context, logout };
};
