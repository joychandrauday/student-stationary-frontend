import { useUpdateOrderMutation } from "@/Redux/features/order/orderApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
interface Payment {
    bank_status: string;
    customer_order_id: string;
}

const useUpdatePaymentStatus = (payment: Payment) => {
    const [updateOrder] = useUpdateOrderMutation()
    useEffect(() => {
        if (!payment) return;

        const updateOrderStatus = async () => {
            try {
                if (payment.customer_order_id) {
                    const updatedData = {
                        paymentStatus: payment.bank_status === "Success" ? "Completed" : "Failed",
                    };
                    await updateOrder({ orderId: payment.customer_order_id, updatedData });
                    toast.success("Order updated successfully!");
                }
            } catch (error) {
                console.error("Error updating order:", error);
                toast.error("Failed to update order");
            }
        };

        updateOrderStatus();
    }, [payment, updateOrder]);
};

export default useUpdatePaymentStatus;
