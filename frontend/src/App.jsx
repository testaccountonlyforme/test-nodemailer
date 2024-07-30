import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';

const tailwindCSS = `
/* Minified version of your Tailwind CSS */
`;

const Invoice = ({ data }) => (
  <div className="max-w-4xl mx-auto p-8 border border-gray-200 shadow-md text-base text-gray-600 font-sans">
    <table className="w-full">
      <tbody>
        <tr className="border-b pb-5 mb-5">
          <td colSpan="2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-5xl font-bold text-gray-800">
                    <img
                      src="https://sparksuite.github.io/simple-html-invoice-template/images/logo.png"
                      alt="Logo"
                      className="w-full max-w-xs"
                    />
                  </td>
                  <td className="text-right">
                    <p>Invoice #: {data.invoiceNumber}</p>
                    <p>Created: {data.createdDate}</p>
                    <p>Due: {data.dueDate}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <tr className="border-b pb-10 mb-10">
          <td colSpan="2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td>
                    <p>{data.companyName}</p>
                    <p>{data.companyAddress}</p>
                  </td>
                  <td className="text-right">
                    <p>{data.clientName}</p>
                    <p>{data.clientEmail}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <tr className="bg-gray-100 border-b">
          <td className="font-bold">Payment Method</td>
          <td className="text-right font-bold">{data.paymentMethod}</td>
        </tr>
        <tr className="border-b">
          <td>{data.paymentMethodDetail}</td>
          <td className="text-right">{data.paymentDetail}</td>
        </tr>

        <tr className="bg-gray-100 border-b">
          <td className="font-bold">Item</td>
          <td className="text-right font-bold">Price</td>
        </tr>

        {data.items.map((item, index) => (
          <tr key={index} className={index === data.items.length - 1 ? 'border-b' : 'border-b'}>
            <td>{item.name}</td>
            <td className="text-right">{item.price}</td>
          </tr>
        ))}

        <tr className="font-bold">
          <td></td>
          <td className="text-right border-t-2 border-gray-200">Total: {data.total}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const App = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    createdDate: '',
    dueDate: '',
    companyName: '',
    companyAddress: '',
    clientName: '',
    clientEmail: '',
    paymentMethod: '',
    paymentMethodDetail: '',
    paymentDetail: '',
    items: [{ name: '', price: '' }],
    total: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = formData.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setFormData((prevData) => ({
      ...prevData,
      items: newItems,
    }));
  };

  const handleAddItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { name: '', price: '' }],
    }));
  };

  const handleGeneratePDF = async () => {
    const htmlString = ReactDOMServer.renderToString(<Invoice data={formData} />);
    const completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${tailwindCSS}</style>
        </head>
        <body>${htmlString}</body>
      </html>
    `;
    try {
      const response = await axios.post(
        'http://localhost:3001/generate-pdf-and-send',
        {
          html: completeHtml,
          recipientEmail: formData.clientEmail,
        }
      );
      if (response.status === 200) {
        alert('Email sent successfully');
      } else {
        alert('Error sending email');
      }
    } catch (error) {
      console.error('Error generating PDF or sending email', error);
      alert('Error generating PDF or sending email');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGeneratePDF();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block">Invoice Number:</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Created Date:</label>
          <input
            type="date"
            name="createdDate"
            value={formData.createdDate}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Company Address:</label>
          <input
            type="text"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Client Email:</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Payment Method:</label>
          <input
            type="text"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Payment Method Detail:</label>
          <input
            type="text"
            name="paymentMethodDetail"
            value={formData.paymentMethodDetail}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Payment Detail:</label>
          <input
            type="text"
            name="paymentDetail"
            value={formData.paymentDetail}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Total:</label>
          <input
            type="text"
            name="total"
            value={formData.total}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Items:</label>
          {formData.items.map((item, index) => (
            <div key={index} className="space-y-2 mb-4">
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Item Name"
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Item Price"
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add Item
          </button>
        </div>
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded"
        >
          Generate PDF and Send Email
        </button>
      </form>
    </div>
  );
};

export default App;
