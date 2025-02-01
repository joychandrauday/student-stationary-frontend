
import { useUpdateOrderMutation } from "@/Redux/features/order/orderApi"; // Assuming you have this API
import toast from "react-hot-toast";

interface Payment {
    customer_order_id?: string;
    bank_status?: string;
}

const useUpdatePaymentStatus = () => {
    const [updateOrder] = useUpdateOrderMutation();

    return async (payment: Payment | null) => {
        if (!payment || !payment.customer_order_id) return;

        try {
            const updatedData = {
                paymentStatus: payment.bank_status === "Success" ? "Completed" : "Failed",
            };

            await updateOrder({ orderId: payment.customer_order_id, updatedData });
            toast.success("Order updated successfully!");
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Failed to update order");
        }
    };
};

export default useUpdatePaymentStatus;
