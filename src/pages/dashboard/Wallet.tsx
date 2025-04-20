import { WalletIcon, ArrowRight, Gift, Download, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/context";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { set } from "date-fns";
// import "react-toastify/dist/ReactToastify.css";

// Replace your current declaration with this:
declare module "jspdf" {
  interface jsPDF {
    autoTable: ((options: any) => jsPDF) & {
      previous: {
        finalY: number;
      };
    };
  }
}
interface Item {
  id: string;
  description: string;
  vCPU: number;
  ram: number;
  ssd: number;
  price: number;
}

interface InvoiceItem {
  itemId: string;
  quantity: number;
  rate: number;
  subtotal: number;
}

interface Transaction {
  date: string;
  transactionId: string;
  amount: number | string;
}

interface Customer {
  name: string;
  address: string;
  stateCode: string;
}

interface InvoiceData {
  companyName: string;
  taxId: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  gstType: "Inclusive" | "Exclusive";
  state: string;
  items: InvoiceItem[];
  discount: number;
  subTotal: number;
  tax: number;
  total: number;
  transactions: Transaction[];
  pdfGeneratedDate: string;
}

const Wallet = () => {
  const navigate = useNavigate();
  const [redeemCode, setRedeemCode] = useState("");
  const {
    user,
    transactions,
    setTransactions,
    payment,
    setPayment,
    generatePDF,
    setUser
  } = useAppContext();

  const handleRedeem = async () => {
    try {
      const response = await axios.get("/api/user/apply_coupon", {
        withCredentials: true,
        params: {
          token: redeemCode,
        },
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        if (response?.data?.user) setUser(response?.data?.user);
      }
      setRedeemCode("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error redeeming code");
    }
  };

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
    };
    if (transactions.length === 0 || payment.length === 0) {
      FetchData();
    }
  }, []);

  interface ITransaction {
    transactionId: string;
    user: string;
    serviceMongoID?: string;
    type: string;
    amount: number;
    description: string;
    createdAt: Date;
  }

  const getDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const relatedTransation = (transactionID: string) => {
    const transaction = transactions.find(
      (transaction: ITransaction) => transaction.transactionId === transactionID
    );
    return transaction;
  };

  const ResentTransactions = (payment: any) => {
    const recentPayments = payment?.slice(0, 5);
    return recentPayments.length > 0 ? recentPayments : [];
  };

  // const calculateTotals = () => {
  //   let subTotal = invoiceData.items.reduce((acc, item) => {
  //     const selectedItem = itemsList.find((i) => i.id === item.itemId);
  //     return acc + (selectedItem ? selectedItem.price * item.quantity : 0);
  //   }, 0);

  //   let tax = 0;
  //   let total = 0;

  //   if (invoiceData.gstType === "Exclusive") {
  //     tax = subTotal * 0.18;
  //     total = subTotal + tax;
  //   } else {
  //     total = subTotal;
  //     subTotal = total / 1.18;
  //     tax = total - subTotal;
  //   }

  //   total -= invoiceData.discount; // Apply discount
  //   setInvoiceData((prevData) => ({ ...prevData, subTotal, tax, total }));
  // };

  // const uploadToExcel = async () => {
  //   try {
  //     await axios.post(
  //       `https://docs.google.com/forms/d/e/1FAIpQLSfzP9YAoLH08MLZUO-LtlCpR2lTCOIF9Bfn-lgv-YPxDrm48A/formResponse?&submit=Submit?usp=pp_url&entry.1888128289=${moment(
  //         invoiceData.invoiceDate
  //       ).format("DD/MM/YYYY")}&entry.824453820=${
  //         invoiceData.invoiceNumber
  //       }&entry.897584116=${invoiceData.state}&entry.1231415132=18%25&entry.1207835655=${parseFloat(
  //         invoiceData.subTotal.toString()
  //       ).toFixed(2)}&entry.978406635=${
  //         invoiceData.state === "UP"
  //           ? parseFloat((invoiceData.tax / 2).toString()).toFixed(2)
  //           : ""
  //       }&entry.555025617=${
  //         invoiceData.state === "UP"
  //           ? parseFloat((invoiceData.tax / 2).toString()).toFixed(2)
  //           : ""
  //       }&entry.1209097425=${
  //         invoiceData.state !== "UP"
  //           ? parseFloat(invoiceData.tax.toString()).toFixed(2)
  //           : ""
  //       }&entry.723332171=${parseFloat(invoiceData.total.toString()).toFixed(2)}`
  //     );
  //     console.log("Done without error");
  //   } catch (error) {
  //     console.error("Done with error", error);
  //   }

  //   toast.success("Uploaded to Excel", {
  //     position: "bottom-right",
  //     // autoClose: 5000,
  //     // hideProgressBar: false,
  //     // closeOnClick: true,
  //     // pauseOnHover: false,
  //     // draggable: true,
  //     // progress: undefined,
  //     // theme: "dark",
  //   });
  // };

  const payPending = async (paymentId: string) => {
    try {
      const res = await axios.post("/api/payment/pay_pending",{
        paymentId: paymentId,
      })
      if(res?.data){
        window.location.href = res?.data?.redirectUrl
      }
    } catch (error) {
      console.log(error)
    }

  }

  const Counter = ({ createdAt }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
      // Skip if no createdAt
      if (!createdAt) {
        setTimeLeft("--:--:--");
        return;
      }

      // Convert createdAt to timestamp
      const createdTime = new Date(createdAt).getTime();
      // Calculate expiry time (createdAt + 1 hour)
      const expiryTime = createdTime + 60 * 60 * 1000; // 1 hour in milliseconds

      // Function to update the countdown
      const updateTimer = () => {
        const now = new Date().getTime();
        const difference = expiryTime - now;

        if (difference <= 0) {
          // Timer expired
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        setTimeLeft(`${formattedMinutes}:${formattedSeconds}`);
      };

      // Update timer immediately and then every second
      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }, [createdAt]);

    return (
      <p className="font-mono text-sm font-medium opacity-65">
        {timeLeft === "Expired" ? (
          <span className="text-red-500">Expired</span>
        ) : (
          <span className="text-amber-600 dark:text-amber-500">{timeLeft}</span>
        )}
      </p>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
          Wallet
        </h2>

        {/* Top Section: Balance and Redeem side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <WalletIcon className="h-5 w-5 text-purple-500" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {user?.balance} NC
              </div>
              <Button
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/dashboard/purchase-netcoins")}
              >
                Add Funds
              </Button>
            </CardContent>
          </Card>

          {/* Redeem Card */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gift className="h-5 w-5 text-emerald-500" />
                Redeem Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter redeem code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="bg-white/50 dark:bg-gray-900/50 border-gray-200/50"
                />
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={handleRedeem}
                >
                  Redeem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/50 dark:bg-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <Button
                onClick={() => navigate("/dashboard/invoices")}
                variant="outline"
                className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View All Invoices
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ResentTransactions(payment)?.map((p: any) => (
                  <div
                    key={p?.transactionID}
                    className="flex justify-between items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    <div>
                      <p className="font-medium">
                        {p?.status !== "Pending"
                          ? relatedTransation(p?.transactionID)?.description
                          : "Pending"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getDate(p?.createdAt)} • {p?.paymentType}
                        {p?.transactionID && ` • Invoice ${p?.transactionID}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-green-600 dark:text-green-400">
                          {p.coinAmout}
                        </div>
                        {p?.Price !== "N/A" && (
                          <div className="text-sm text-muted-foreground">
                            {p?.paymentType !== "Cryptomous" ? "₹" : "$"}
                            {p?.Price}
                          </div>
                        )}
                      </div>
                      {p?.status === "Pending" && (
                        <Counter createdAt={p?.createdAt} />
                      )}
                      {/* {p?.paymentType === "Cryptomous" && ( */}
                      {p?.paymentType !== "Cryptomous" &&
                        (p?.status === "Pending" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ padding: "5px" }}
                            title="UPI Only"
                            onClick={() => payPending(p?._id)}
                          >
                            <QrCode className="h-4 w-4" />
                            <span className="text-xs">Pay</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => generatePDF(p)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download Invoice</span>
                          </Button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
