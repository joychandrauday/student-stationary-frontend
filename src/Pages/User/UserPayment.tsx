/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useVerifyOrderQuery } from "@/Redux/features/order/orderApi";
import { useSearchParams } from "react-router-dom";
import useUpdatePaymentStatus from "@/Utils/useUpdatePamentStatus";

interface Payment {
    order_id?: string;
    customer_order_id?: string;
    bank_trx_id?: string;
    amount?: number;
    payable_amount?: number;
    method?: string;
    bank_status?: string;
}

const UserPayment = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");
    const { isLoading, data } = useVerifyOrderQuery(orderId, {
        refetchOnMountOrArgChange: true,
    });

    const [isModalOpen, setIsModalOpen] = useState(true);
    const updatePaymentStatus = useUpdatePaymentStatus(); // Get the function from the hook

    if (isLoading) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    if (!data || !data.data || data.data.length === 0) {
        return <div className="text-center text-red-500 text-lg font-semibold">No payment data found</div>;
    }

    const payment: Payment | null = data?.data?.[0] || null;

    useEffect(() => {
        if (!isModalOpen && payment) {
            updatePaymentStatus(payment); // Call the function after modal is closed
        }
    }, [isModalOpen, payment, updatePaymentStatus]);

    return (
        <div className="max-w-3xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-4 text-primary">Payment Details</h2>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Payment Confirmation</h3>
                        <p>Please review your payment status and confirm.</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Details */}
            <div className="grid grid-cols-2 text-black gap-4">
                <p><span className="font-semibold">Order ID:</span> {payment?.order_id}</p>
                <p><span className="font-semibold">Transaction ID:</span> {payment?.bank_trx_id}</p>
                <p><span className="font-semibold">Amount:</span> {payment?.amount} BDT</p>
                <p><span className="font-semibold">Payable Amount:</span> {payment?.payable_amount} BDT</p>
                <p><span className="font-semibold">Method:</span> {payment?.method}</p>
                <p>
                    <span className="font-semibold">Bank Status:</span>
                    <span className={payment?.bank_status === "Success" ? "text-green-500" : "text-red-500"}>
                        {payment?.bank_status}
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
};

export default UserPayment;
