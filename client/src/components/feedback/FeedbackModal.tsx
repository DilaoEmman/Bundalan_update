// import React, { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Rating,
// } from "@mui/material";

// interface FeedbackModalProps {
//   open: boolean;
//   onClose: () => void;
//   orderId: number;
//   customerId?: number;
// }

// const FeedbackModal: React.FC<FeedbackModalProps> = ({
//   open,
//   onClose,
//   orderId,
//   customerId,
// }) => {
//   const [rating, setRating] = useState<number | null>(null);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     await fetch("/api/v1/surveys", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         order_id: orderId,
//         customer_id: customerId,
//         rating,
//         comment,
//       }),
//     });
//     setSubmitting(false);

//     // <-- Add this line to trigger refresh in Reports page and Feedback page
//     window.dispatchEvent(new Event("feedbackAdded"));

//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           p: 4,
//           background: "#fff",
//           m: "auto",
//           mt: "10%",
//           borderRadius: 2,
//           width: 400,
//         }}
//       >
//         <Typography variant="h6">How was your experience?</Typography>
//         <Rating
//           value={rating}
//           onChange={(_, newValue) => setRating(newValue)}
//           max={5}
//         />
//         <TextField
//           label="Comments (optional)"
//           fullWidth
//           multiline
//           rows={2}
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           sx={{ mt: 2 }}
//         />
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={!rating || submitting}
//           sx={{ mt: 2 }}
//         >
//           Submit Feedback
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default FeedbackModal;
