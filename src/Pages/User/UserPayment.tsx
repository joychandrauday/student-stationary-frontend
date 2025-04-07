/* eslint-disable prefer-const */
import { useGettingSingleOrderQuery, useUpdateWholeOrderMutation, useVerifyOrderQuery } from '@/Redux/features/order/orderApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/studentstationarylogo.png'
import { IOrder } from '@/Interfaces/types';
import LoadingPage from '@/pageComponent/Shared/LoadingPage';

const UserPayment = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");
    const [spId, setSpId] = useState('')
    const [updateWholeOrder] = useUpdateWholeOrderMutation();
    const { data: order } = useGettingSingleOrderQuery(spId)
    const orderData = order?.data
    const { isLoading, data } = useVerifyOrderQuery(orderId, {
        refetchOnMountOrArgChange: true,
    });
    useEffect(() => {
        if (!isLoading && data?.data?.length > 0) {
            Swal.fire({
                title: "Payment Confirmation!",
                text: `Your payment attempt was ${data?.data[0]?.bank_status}`,
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const payment = data?.data?.[0];

                        if (payment?.customer_order_id) {

                            setSpId(payment?.customer_order_id)
                            const updatedData = {
                                paymentStatus: payment.bank_status === "Success" ? "Completed" : "Failed",
                                orderStatus: payment.bank_status === "Success" ? "Processing" : "Pending",
                            };
                            await updateWholeOrder({ orderId: payment.customer_order_id, updatedData });
                            toast.success("Order placed successfully!");
                        }
                    } catch (error) {
                        console.error("Error updating order:", error);
                        toast.error("Failed to update order");
                    }
                }
            });
        }
    }, [isLoading, data, updateWholeOrder]);
    const generateInvoice = (orderData: IOrder) => {
        const doc = new jsPDF();

        // Add logo to the document with padding
        doc.addImage(logo, 'PNG', 160, 10, 45, 13);

        // Set a bold font for the title with larger size
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text('INVOICE', 14, 20);

        // Reset font for the rest of the document
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        const { createdAt, shippingAddress, products, transaction, orderStatus, paymentStatus, estimatedDeliveryDate, user } = orderData;
        const orderDate = new Date(createdAt).toLocaleDateString();

        // Ensure necessary data is available
        if (!createdAt || !shippingAddress || !products || !transaction || !orderStatus || !paymentStatus || !estimatedDeliveryDate) {
            return;
        }

        const estimatedDelivery = new Date(estimatedDeliveryDate).toLocaleDateString();
        let YH = 40; // Adjusted Y position for content

        // Left side: Order-related info
        doc.setFontSize(12);
        doc.text(`Order Date: ${orderDate}`, 14, YH);
        YH += 7;
        doc.text(`Transaction ID: ${transaction.id}`, 14, YH);
        YH += 7;
        doc.text(`Transaction Status: ${paymentStatus}`, 14, YH);
        YH += 7;
        doc.text(`Order Status: ${orderStatus}`, 14, YH);
        YH += 7;
        doc.text(`Estimated Delivery Date: ${estimatedDelivery}`, 14, YH);

        let userDetailsY = YH + 7;
        doc.text(`User Name: ${user.name}`, 14, userDetailsY);
        userDetailsY += 7;
        doc.text(`Shipping Address: ${shippingAddress}`, 14, userDetailsY);

        // Table styling
        let finalY = userDetailsY + 15;  // Adjust start Y for the table

        // Set the heading for products with styling
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('Products:', 14, finalY);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        // Create table with better formatting
        autoTable(doc, {
            startY: finalY + 5,
            head: [['Product Name', 'Quantity', 'Price (Taka)', 'Total (Taka)']],
            body: products.map(product => [
                product.productId.name,  // Adjusted to your data structure
                product.quantity,
                product.price,
                product.totalPrice
            ]),
            theme: 'grid', // Add grid style to the table
            headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontSize: 12, font: 'helvetica', halign: 'center' },
            bodyStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontSize: 11, font: 'helvetica', halign: 'center' },
            alternateRowStyles: { fillColor: [255, 255, 255] }, // Alternating row colors for better readability
            didDrawPage: (data) => {
                // Calculate subtotal here
                let subtotal = products.reduce((total, product) => total + product.totalPrice, 0);

                // Add subtotal to the bottom of the table with custom positioning
                doc.setFont("helvetica", "bold");
                doc.text(`Subtotal: Taka ${subtotal.toFixed(2)}`, 14, data.cursor ? data.cursor.y + 10 : 0 + 25);
                doc.setFont("helvetica", "normal");
            }
        });


        // Add footer with company info or additional notes
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for your purchase!", 14, doc.internal.pageSize.height - 20);
        doc.text("For support, contact us at: joychandraud@gmail.com", 14, doc.internal.pageSize.height - 15);
        doc.text("Buy more: https://student-stationary-frontend.vercel.app/products", 14, doc.internal.pageSize.height - 10);

        // Save the generated PDF
        doc.save('Invoice_' + orderData._id + '.pdf');
    };





    if (isLoading) {
        return <LoadingPage />;
    }

    if (!data || !data.data || data.data.length === 0) {
        return <div className="text-center text-red-500 text-lg font-semibold">No payment data found</div>;
    }

    const payment = data?.data?.[0] || null;

    return (
        <div className="max-w-3xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-4 text-primary">Payment Details</h2>

            <div className="grid grid-cols-2 text-black gap-4">
                <p><span className="font-semibold">Order ID:</span> {payment.order_id}</p>
                <p><span className="font-semibold">Transaction ID:</span> {payment.bank_trx_id}</p>
                <p><span className="font-semibold">Amount:</span> {payment.amount} BDT</p>
                <p><span className="font-semibold">Payable Amount:</span> {payment.payable_amount} BDT</p>
                <p><span className="font-semibold">Method:</span> {payment.method}</p>
                <p><span className="font-semibold">Payment Status:</span>
                    <span className={payment.bank_status === "Success" ? "text-green-500" : "text-red-500"}>
                        {payment.bank_status}
                    </span>
                </p>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => generateInvoice(orderData)} // Call the generateInvoice function
                    className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-foreground"
                >
                    Download Invoice
                </button>
            </div>
        </div >
    );
};

export default UserPayment;
