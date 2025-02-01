/* eslint-disable react-hooks/rules-of-hooks */
import { useUpdateOrderMutation, useVerifyOrderQuery } from '@/Redux/features/order/orderApi';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const UserPayment = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");
    const [updateOrder] = useUpdateOrderMutation();
    const { isLoading, data } = useVerifyOrderQuery(orderId, {
        refetchOnMountOrArgChange: true,
    });

    if (isLoading) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    if (!data || !data.data || data.data.length === 0) {
        return <div className="text-center text-red-500 text-lg font-semibold">No payment data found</div>;
    }

    const payment = data?.data?.[0] || null; // ডেটা নিশ্চিত করা

    useEffect(() => {
        if (!payment) return; // যদি payment ডেটা না থাকে, তাহলে কিছু না করো

        const updateOrderStatus = async () => {
            try {
                if (payment.customer_order_id) {
                    const updatedData = {
                        paymentStatus: payment.bank_status === "Success" ? "Completed" : "Failed",
                    };
                    await updateOrder({ orderId: payment.customer_order_id, updatedData });
                    toast.success('Order updated successfully!');
                }
            } catch (error) {
                console.error("Error updating order:", error);
                toast.error('Failed to update order');
            }
        };

        updateOrderStatus();
    }, [payment, updateOrder]);

    return (
        <div className="max-w-3xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-4 text-primary">Payment Details</h2>

            <div className="grid grid-cols-2 text-black gap-4">
                <p><span className="font-semibold">Order ID:</span> {payment.order_id}</p>
                <p><span className="font-semibold">Transaction ID:</span> {payment.bank_trx_id}</p>
                <p><span className="font-semibold">Amount:</span> {payment.amount} BDT</p>
                <p><span className="font-semibold">Payable Amount:</span> {payment.payable_amount} BDT</p>
                <p><span className="font-semibold">Method:</span> {payment.method}</p>
                <p><span className="font-semibold">Bank Status:</span>
                    <span className={payment.bank_status === "Success" ? "text-green-500" : "text-red-500"}>
                        {payment.bank_status}
                    </span>
                </p>
            </div>

            <div className="mt-6">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                    Download Invoice
                </button>
            </div>
        </div>
    );
}

export default UserPayment;
