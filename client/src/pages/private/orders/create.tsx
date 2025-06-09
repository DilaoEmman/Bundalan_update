import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store/rootStore";
import AddNewItemForm from "./addNewItemForm";
import AllItemsList from "./allItemsList";
import ServerSideAutoComplete from "../../../components/ui/ServerSideAutocomplete/ServerSideAutoComplete";
import SurveyModal from "../../../components/survey/SurveyModal";
import FarewellMessageDisplay from "../../../components/farewell/FarewellMessageDisplay"; // <-- Import the component

const Create = () => {
  const {
    rootStore: { orderStore, customerStore, authStore },
  } = useStore();
  const userRole = authStore.userRole;
  const navigate = useNavigate();

  const [showSurvey, setShowSurvey] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [productsErrorMessage, setProductsErrorMessage] = useState<
    string | null
  >(null);
  const [farewellMessage, setFarewellMessage] = useState<string>(""); // <-- Add state

  const validationSchema = Yup.object().shape({
    customer: Yup.object()
      .shape({
        id: Yup.string().required("Customer is required"),
        label: Yup.string().required("Customer is required"),
      })
      .required("Customer is required"),
  });

  const hookFromObj = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: { id: "", label: "" },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = hookFromObj;

  const onSubmit = async (data: any) => {
    try {
      setProductsErrorMessage(null);
      setFarewellMessage(""); // Reset before creating order
      const resData = await orderStore.createData(data);
      console.log("Order creation response:", resData);

      // Try to extract orderId and farewell message from response
      const orderId =
        resData?.data?.order?.id ||
        resData?.data?.id ||
        resData?.data?.orderId ||
        resData?.data?.order_id ||
        resData?.data?.[0]?.id; // add more as needed

      // Extract farewell_message if present
      const farewellMsg =
        resData?.data?.farewell_message || resData?.farewell_message || "";

      console.log("Extracted orderId for survey:", orderId);
      console.log("Extracted farewell message:", farewellMsg);

      if (resData && orderId) {
        reset({
          customer: { id: "", label: "" },
        });
        orderStore.setCartItems([]);
        setLastOrderId(orderId);
        setShowSurvey(true);
        setFarewellMessage(farewellMsg); // <-- Set message for display
      } else {
        setProductsErrorMessage(
          "Order was created but order ID was not found in backend response!"
        );
      }
    } catch (error: any) {
      Object.keys(error?.data || {}).forEach((e: any) => {
        setError(e, {
          type: "manual",
          message: error?.data[e],
        });
      });
      setProductsErrorMessage("Please select one products");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Create</h4>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid sx={{ flex: "1 1 50%" }}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <ServerSideAutoComplete
                  label="Select a customer"
                  ajaxCallFn={customerStore.getList}
                  onOptionSelect={(option) => field.onChange(option)}
                  error={errors.customer?.id ?? errors.customer}
                  field={field}
                />
              )}
            />
          </Grid>
        </Grid>
        <AddNewItemForm />
        {productsErrorMessage ? (
          <Box sx={{ color: "error.main", my: 2 }}>{productsErrorMessage}</Box>
        ) : (
          ""
        )}
        <AllItemsList editMode={true} />
        <Button
          sx={{ mt: 2 }}
          type="submit"
          variant="contained"
          color="success"
        >
          Save
        </Button>
        <Button
          sx={{ mt: 2, ml: 2 }}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </form>
      {/* Show the farewell message after order creation */}
      {farewellMessage && <FarewellMessageDisplay message={farewellMessage} />}
      {showSurvey && lastOrderId && (
        <SurveyModal
          open={showSurvey}
          onClose={() => {
            setShowSurvey(false);
            setLastOrderId(null);
            navigate("..");
          }}
          orderId={lastOrderId}
          onSubmitted={() => {
            setShowSurvey(false);
            setLastOrderId(null);
            navigate("..");
          }}
        />
      )}
    </Box>
  );
};

export default observer(Create);
