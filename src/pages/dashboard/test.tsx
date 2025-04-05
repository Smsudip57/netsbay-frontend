import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import axios from "axios";
import {  toast } from "sonner";
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
  companyAddress: string;
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

const itemsList: Item[] = [
  {
    id: "LINUX-VPS-0",
    description: "LINUX VPS-0",
    vCPU: 1,
    ram: 1,
    ssd: 10,
    price: 400,
  },
  {
    id: "LINUX-VPS-1",
    description: "LINUX VPS-1",
    vCPU: 1,
    ram: 2,
    ssd: 10,
    price: 500,
  },
  {
    id: "LINUX-VPS-2",
    description: "LINUX VPS-2",
    vCPU: 2,
    ram: 4,
    ssd: 10,
    price: 600,
  },
  {
    id: "LINUX-VPS-3",
    description: "LINUX VPS-3",
    vCPU: 4,
    ram: 8,
    ssd: 30,
    price: 1000,
  },
  {
    id: "WINDOWS-RDP-1",
    description: "WINDOWS RDP-1",
    vCPU: 2,
    ram: 4,
    ssd: 30,
    price: 700,
  },
  {
    id: "WINDOWS-RDP-2",
    description: "WINDOWS RDP-2",
    vCPU: 4,
    ram: 8,
    ssd: 50,
    price: 1200,
  },
  {
    id: "WINDOWS-RDP-3",
    description: "WINDOWS RDP-3",
    vCPU: 6,
    ram: 16,
    ssd: 30,
    price: 1800,
  },
];

const InvoiceCreator: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: "TECHNOCONNECT IT SOLUTIONS PVT LTD",
    companyAddress:
      "1934 Vishal Vihar Dubagga, Thakurganj, Lucknow, Uttar Pradesh, 226003",
    taxId: "09AAKCT2618Q1ZM",
    clientName: "",
    clientAddress: "",
    invoiceNumber: "1",
    invoiceDate: "",
    dueDate: "",
    gstType: "Inclusive",
    state: "UP",
    items: [],
    discount: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    transactions: [],
    pdfGeneratedDate: new Date().toLocaleDateString(),
  });

  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [addressSelect, setAddressSelect] = useState<boolean>(false);

  const handleNameInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });

    if (value) {
      try {
        const response = await axios.get<{ customers: Customer[] }>(
          `https://invoicebackend.netbay.in/customers?search=${value}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        setCustomerList(response.data.customers);
        setAddressSelect(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.log("Response error:", error.response.data);
          } else if (error.request) {
            console.log("Request error:", error.request);
          } else {
            console.log("Axios Error:", error.message);
          }
        } else {
          console.log("Unexpected error:", error);
        }
      }
    } else {
      setCustomerList([]);
    }
  };

  const handleAddressData = (e: React.MouseEvent, customer: Customer) => {
    e.preventDefault();
    setAddressSelect(true);
    setInvoiceData({
      ...invoiceData,
      clientName: customer.name,
      clientAddress: customer.address,
      state: customer.stateCode,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "discount" ? parseFloat(value) || 0 : value;
    
    if (name === "invoiceDate") {
      const dueDate = moment(value).add(2, "days").format("YYYY-MM-DD");
      setInvoiceData({
        ...invoiceData,
        [name]: newValue,
        dueDate,
      });
    } else {
      setInvoiceData({
        ...invoiceData,
        [name]: newValue,
      });
    }
  };

  const addItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { itemId: "", quantity: 1, rate: 0, subtotal: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedItems = invoiceData.items.map((item, idx) => {
      if (idx === index) {
        const updatedItem = { ...item, [name]: value };
        const selectedItem = itemsList.find(
          (it) => it.id === updatedItem.itemId
        );
        
        if (name === "itemId" && selectedItem) {
          updatedItem.rate = selectedItem.price;
          updatedItem.subtotal = selectedItem.price * updatedItem.quantity;
        }
        
        if (name === "quantity" && selectedItem) {
          const qty = parseInt(value as string) || 0;
          updatedItem.subtotal = selectedItem.price * qty;
        }
        
        return updatedItem;
      }
      return item;
    });

    setInvoiceData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const handleGSTTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInvoiceData({
      ...invoiceData,
      gstType: e.target.value as "Inclusive" | "Exclusive",
    });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInvoiceData({
      ...invoiceData,
      state: e.target.value,
    });
  };

  const addTransaction = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      transactions: [
        ...prevData.transactions,
        { date: prevData.invoiceDate, transactionId: "", amount: 0 },
      ],
    }));
  };

  const handleTransactionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => {
      const newTransactions = [...prevData.transactions];
      newTransactions[index] = { ...newTransactions[index], [name]: value };
      return { ...prevData, transactions: newTransactions };
    });
  };

  const removeTransaction = (index: number) => {
    setInvoiceData((prevData) => {
      const newTransactions = [...prevData.transactions];
      newTransactions.splice(index, 1);
      return { ...prevData, transactions: newTransactions };
    });
  };

  const calculateTotals = () => {
    let subTotal = invoiceData.items.reduce((acc, item) => {
      const selectedItem = itemsList.find((i) => i.id === item.itemId);
      return acc + (selectedItem ? selectedItem.price * item.quantity : 0);
    }, 0);
    
    let tax = 0;
    let total = 0;

    if (invoiceData.gstType === "Exclusive") {
      tax = subTotal * 0.18;
      total = subTotal + tax;
    } else {
      total = subTotal;
      subTotal = total / 1.18;
      tax = total - subTotal;
    }
    
    total -= invoiceData.discount; // Apply discount
    setInvoiceData((prevData) => ({ ...prevData, subTotal, tax, total }));
  };

  const formatDateString = (dateString: string): string => {
    return moment(dateString).format("dddd, MMMM Do, YYYY");
  };

  const formatItemDescription = (item?: Item): string => {
    if (!item) return "";
    
    const startDate = moment(invoiceData.invoiceDate).format("DD/MM/YYYY");
    const endDate = moment(startDate, "DD/MM/YYYY")
      .add(1, "months")
      .format("DD/MM/YYYY");
      
    return `${item.description}\n${item.vCPU} vCPU\n${item.ram}GB RAM\n${item.ssd}GB SSD\n(${startDate} - ${endDate})`;
  };

  const uploadToExcel = async () => {
    try {
      await axios.post(
        `https://docs.google.com/forms/d/e/1FAIpQLSfzP9YAoLH08MLZUO-LtlCpR2lTCOIF9Bfn-lgv-YPxDrm48A/formResponse?&submit=Submit?usp=pp_url&entry.1888128289=${moment(
          invoiceData.invoiceDate
        ).format("DD/MM/YYYY")}&entry.824453820=${
          invoiceData.invoiceNumber
        }&entry.897584116=${invoiceData.state}&entry.1231415132=18%25&entry.1207835655=${parseFloat(
          invoiceData.subTotal.toString()
        ).toFixed(2)}&entry.978406635=${
          invoiceData.state === "UP"
            ? parseFloat((invoiceData.tax / 2).toString()).toFixed(2)
            : ""
        }&entry.555025617=${
          invoiceData.state === "UP"
            ? parseFloat((invoiceData.tax / 2).toString()).toFixed(2)
            : ""
        }&entry.1209097425=${
          invoiceData.state !== "UP"
            ? parseFloat(invoiceData.tax.toString()).toFixed(2)
            : ""
        }&entry.723332171=${parseFloat(invoiceData.total.toString()).toFixed(2)}`
      );
      console.log("Done without error");
    } catch (error) {
      console.error("Done with error", error);
    }

    toast.success("Uploaded to Excel", {
      position: "bottom-right",
      // autoClose: 5000,
      // hideProgressBar: false,
      // closeOnClick: true,
      // pauseOnHover: false,
      // draggable: true,
      // progress: undefined,
      // theme: "dark",
    });
  };

  const generatePDF = async () => {
    try {
      // await uploadToExcel();

    const doc = new jsPDF();
    const imgSrc = "./logo.jpeg";
    const paidSrc = "./paid.png";

    // Adding the company logo
    doc.addImage(imgSrc, "JPEG", 15, 10, 72, 30);
    doc.addImage(paidSrc, "PNG", 160, 0, 50, 37.5);

    const x = 20;
    // Adding company information next to the logo
    doc.setFont("times-new-roman");
    doc.setFontSize(14);
    doc.text(invoiceData.companyName, 96, 15 + x);
    doc.setFontSize(8);
    doc.text(invoiceData.companyAddress, 110, 20 + x);
    doc.text(`GSTIN: ${invoiceData.taxId}`, 159, 25 + x);

    // Adding a gray box for invoice details
    doc.setFillColor(220, 220, 220);
    doc.rect(15, 30 + x, 180, 25, "F");
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(13);
    doc.setFont("times-new-roman", "bold");
    doc.text(`Invoice #${invoiceData.invoiceNumber}`, 16, 35 + x);
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Invoice Date: ${moment(invoiceData.invoiceDate).format(
        "dddd, MMMM Do, YYYY"
      )}`,
      16,
      45 + x
    );
    doc.text(
      `Due Date: ${moment(invoiceData.dueDate).format("dddd, MMMM Do, YYYY")}`,
      16,
      50 + x
    );

    // Client information
    doc.setFontSize(11);
    doc.setFont("times-new-roman", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text("Invoiced To:", 16, 65 + x);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(invoiceData.clientName, 16, 70 + x);
    doc.text(invoiceData.clientAddress, 16, 80 + x);
    doc.text("India", 16, 84 + x);

    // Items Table
    doc.autoTable({
      startY: 90 + x,
      head: [["Description", "Rate", "Quantity", "Subtotal"]],
      body: invoiceData.items.map((item) => {
        const selectedItem = itemsList.find((i) => i.id === item.itemId);
        const itemDescription = formatItemDescription(selectedItem);
        const itemSubtotal = selectedItem
          ? (selectedItem.price * item.quantity).toFixed(2)
          : "0.00";
        return [
          itemDescription,
          `Rs. ${selectedItem?.price.toFixed(2) || "0.00"}`,
          item.quantity,
          `Rs. ${itemSubtotal}`,
        ];
      }),
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
    
    // Subtotals and totals
    doc.setFontSize(9);
    doc.setFillColor(220, 220, 220);
    doc.rect(14, tableBottomY - 5, 135, 7, "F");
    doc.text("Discount", 135, tableBottomY);
    doc.setFillColor(220, 220, 220);
    doc.rect(150, tableBottomY - 5, 44, 7, "F");
    doc.text(
      `Rs. ${parseFloat(invoiceData.discount.toString()).toFixed(2)} INR`,
      155,
      tableBottomY
    );
    
    doc.setFillColor(220, 220, 220);
    doc.rect(14, tableBottomY + 3, 135, 7, "F");
    doc.text("Sub Total", 134, tableBottomY + 8);
    doc.setFillColor(220, 220, 220);
    doc.rect(150, tableBottomY + 3, 44, 7, "F");
    doc.text(
      `Rs. ${parseFloat(invoiceData.subTotal.toString()).toFixed(2)} INR`,
      155,
      tableBottomY + 8
    );

    doc.setFillColor(220, 220, 220);
    doc.rect(14, tableBottomY + 11, 135, 7, "F");
    
    if (invoiceData.state === "UP") {
      doc.text("9.00% CGST + 9.00% SGST/ TAX", 99, tableBottomY + 16);
    } else {
      doc.text("18.00% GST / TAX", 121, tableBottomY + 16);
    }
    
    doc.setFillColor(220, 220, 220);
    doc.rect(150, tableBottomY + 11, 44, 7, "F");
    doc.text(
      `Rs. ${parseFloat(invoiceData.tax.toString()).toFixed(2)} INR`,
      155,
      tableBottomY + 16
    );

    doc.setFont("helvetica", "bold");
    doc.setFillColor(220, 220, 220);
    doc.rect(14, tableBottomY + 19, 135, 7, "F");
    doc.text("Total", 140, tableBottomY + 24);
    doc.setFillColor(220, 220, 220);
    doc.rect(150, tableBottomY + 19, 44, 7, "F");
    doc.text(
      `Rs. ${parseFloat(invoiceData.total.toString()).toFixed(2)} INR`,
      155,
      tableBottomY + 24
    );

    doc.setFontSize(12);
    doc.setFont("times-new-roman", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text("Transactions", 16, tableBottomY + 45);

    doc.setFont("helvetica", "normal");
    
    // Transactions table
    doc.autoTable({
      startY: tableBottomY + 50,
      head: [["Transaction Date", "Gateway", "Transaction ID", "Amount"]],
      body: invoiceData.transactions.map((transaction) => [
        formatDateString(transaction.date),
        "UPI (India)",
        transaction.transactionId,
        `Rs. ${parseFloat(transaction.amount.toString()).toFixed(2)} INR`,
      ]),
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
    
    const totalPaid = invoiceData.transactions.reduce(
      (acc, t) => acc + parseFloat(t.amount.toString() || "0"),
      0
    );
    
    doc.text(
      `Rs. ${(parseFloat(invoiceData.total.toString()) - totalPaid).toFixed(2)} INR`,
      155,
      transactionTableY + 5
    );
    
    doc.setFont("helvetica", "normal");

    // PDF Generation Date
    doc.setFontSize(8);
    doc.text(
      `PDF Generated on ${moment(invoiceData.pdfGeneratedDate).format(
        "dddd, MMMM Do YYYY,"
      )}`,
      78,
      transactionTableY + 30
    );

    // Save the PDF
    doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Invoice Creator</h1>
      </div>
      <form>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={invoiceData.clientName}
            onChange={handleNameInput}
          />
          {!addressSelect &&
            customerList.map((customer, index) => (
              <span
                key={index}
                onClick={(e) => handleAddressData(e, customer)}
                className="customer-option"
              >
                {customer.name} - {customer.stateCode}: {customer.address}
              </span>
            ))}
        </div>
        <div>
          <label>Client Address:</label>
          <input
            type="text"
            name="clientAddress"
            value={invoiceData.clientAddress}
            onChange={handleInputChange}
          />
        </div>
        <div className="full-width">
          <label>STATE:</label>
          <select
            name="state"
            value={invoiceData.state}
            onChange={handleStateChange}
          >
            <option value="AN">Andaman and Nicobar Islands - AN</option>
            <option value="AP">Andhra Pradesh - AP</option>
            <option value="AR">Arunachal Pradesh - AR</option>
            <option value="AS">Assam - AS</option>
            <option value="BR">Bihar - BR</option>
            <option value="CH">Chandigarh - CH</option>
            <option value="CT">Chhattisgarh - CT</option>
            <option value="DN">Dadra and Nagar Haveli and Daman and Diu - DN</option>
            <option value="DL">Delhi - DL</option>
            <option value="GA">Goa - GA</option>
            <option value="GJ">Gujarat - GJ</option>
            <option value="HR">Haryana - HR</option>
            <option value="HP">Himachal Pradesh - HP</option>
            <option value="JK">Jammu and Kashmir - JK</option>
            <option value="JH">Jharkhand - JH</option>
            <option value="KA">Karnataka - KA</option>
            <option value="KL">Kerala - KL</option>
            <option value="LA">Ladakh - LA</option>
            <option value="LD">Lakshadweep - LD</option>
            <option value="MP">Madhya Pradesh - MP</option>
            <option value="MH">Maharashtra - MH</option>
            <option value="MN">Manipur - MN</option>
            <option value="ML">Meghalaya - ML</option>
            <option value="MZ">Mizoram - MZ</option>
            <option value="NL">Nagaland - NL</option>
            <option value="OR">Odisha - OR</option>
            <option value="PY">Puducherry - PY</option>
            <option value="PB">Punjab - PB</option>
            <option value="RJ">Rajasthan - RJ</option>
            <option value="SK">Sikkim - SK</option>
            <option value="TN">Tamil Nadu - TN</option>
            <option value="TG">Telangana - TG</option>
            <option value="TR">Tripura - TR</option>
            <option value="UP">Uttar Pradesh - UP</option>
            <option value="UT">Uttarakhand - UT</option>
            <option value="WB">West Bengal - WB</option>
          </select>
        </div>

        <div>
          <label>Invoice Number:</label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            required
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Invoice Date:</label>
          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={invoiceData.dueDate}
            readOnly
          />
        </div>
        <div>
          <label>GST Type:</label>
          <select
            name="gstType"
            value={invoiceData.gstType}
            onChange={handleGSTTypeChange}
          >
            <option value="Inclusive">Inclusive</option>
            <option value="Exclusive">Exclusive</option>
          </select>
        </div>
        <div className="full-width">
          <label>Discount:</label>
          <input
            type="number"
            name="discount"
            value={invoiceData.discount}
            onChange={handleInputChange}
            placeholder="Enter discount amount"
          />
        </div>
        <div className="full-width">
          <h3>Items</h3>
          {invoiceData.items.map((item, index) => (
            <div className="item" key={index}>
              <div>
                <select
                  name="itemId"
                  value={item.itemId}
                  onChange={(e) => handleItemChange(e, index)}
                >
                  <option value="">Select an Item</option>
                  {itemsList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.description} - {option.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index)}
                />
              </div>
              <div>
                <button type="button" onClick={() => removeItem(index)}>
                  Remove Item
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem}>
            Add Item
          </button>
        </div>
        <div className="full-width">
          <h3>Transactions</h3>
          {invoiceData.transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div>
                <label>Transaction Date:</label>
                <input
                  type="date"
                  name="date"
                  value={transaction.date}
                  onChange={(e) => handleTransactionChange(e, index)}
                />
              </div>
              <div>
                <label>Transaction ID:</label>
                <input
                  type="text"
                  name="transactionId"
                  value={transaction.transactionId}
                  onChange={(e) => handleTransactionChange(e, index)}
                />
              </div>
              <div>
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={transaction.amount}
                  onChange={(e) => handleTransactionChange(e, index)}
                />
              </div>
              <div>
                <button type="button" onClick={() => removeTransaction(index)}>
                  Remove Transaction
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addTransaction}>
            Add Transaction
          </button>
        </div>
        <div className="full-width">
          <p>
            <b>Total:</b> {invoiceData.total} <br />
            <b>Balance:</b>{" "}
            {(
              parseFloat(invoiceData.total.toString()) -
              invoiceData.transactions.reduce(
                (acc, t) => acc + parseFloat(t.amount.toString() || "0"),
                0
              )
            ).toFixed(2)}
          </p>
          <p>
            <b>Details</b>
            <br />
            Invoice NO: {invoiceData.invoiceNumber}
            <br />
            Name: {invoiceData.clientName}
            <br />
            Address: {invoiceData.clientAddress}
            <br />
            Date: {invoiceData.invoiceDate}
            <br />
            State: {invoiceData.state}
          </p>
          <button type="button" onClick={calculateTotals}>
            Calculate Totals
          </button>
          <button type="button" onClick={generatePDF}>
            Generate PDF
          </button>
        </div>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default InvoiceCreator;