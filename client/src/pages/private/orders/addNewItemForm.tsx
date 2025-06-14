import React from "react";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../../store/rootStore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ServerSideAutoComplete from "../../../components/ui/ServerSideAutocomplete/ServerSideAutoComplete";
import { observer } from "mobx-react-lite";

const validationSchema = Yup.object().shape({
  product: Yup.object()
    .shape({
      id: Yup.string().required("Product is required"),
      label: Yup.string().required("Product is required"),
    })
    .required("Product is required"),
  price: Yup.number(),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Minimum quantity is 1"),
  discount: Yup.number()
    .required("Discount is required")
    .min(0, "Minimum discount is 0")
    .max(100, "Max discount is 100"),
  total: Yup.number(),
});

const AddNewItemForm: React.FC<any> = () => {
  const {
    rootStore: { orderStore, productStore },
  } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product: { id: "", label: "" },
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    },
  });

  const onSubmit = async (data: any) => {
    orderStore.addToCart(data);
    reset({
      product: { id: "", label: "" },
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    });
  };

  const handleSelectProduct = (value: any) => {
    setValue("product", value);
    setValue("price", value?.price);
    setValue("total", value?.price);
    setValue("quantity", 1);
  };

  const calculateFinalPrice = () => {
    const original = getValues("price") ?? 0;
    const discount = getValues("discount") ?? 0;
    const finalPrice = original - (original * discount) / 100;
    setValue("total", finalPrice * getValues("quantity"));
  };

  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{ my: 3 }}
    >
      <Grid sx={{ flex: "1 1 15%" }}>
        <Controller
          key={"product"}
          name="product"
          control={control}
          render={({ field }) => (
            <ServerSideAutoComplete
              label="Select a product"
              ajaxCallFn={productStore.getList}
              onOptionSelect={(option) => {
                field.onChange(option);
                handleSelectProduct(option);
              }}
              error={errors.product?.id ?? errors.product}
              field={field}
            />
          )}
        />
      </Grid>
      <Grid sx={{ flex: "1 1 10%" }}>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              {...field}
              fullWidth
              id="price"
              label="Price"
              variant="filled"
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          )}
        />
      </Grid>
      <Grid xs={2}>
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              onChange={(e) => {
                field.onChange(e);
                calculateFinalPrice();
              }}
              fullWidth
              id="quantity"
              label="Quantity"
              variant="filled"
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          )}
        />
      </Grid>
      <Grid xs={2}>
        <Controller
          name="discount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              onChange={(e) => {
                field.onChange(e);
                calculateFinalPrice();
              }}
              fullWidth
              id="discount"
              label="Discount (%)"
              variant="filled"
              error={!!errors.discount}
              helperText={errors.discount?.message}
            />
          )}
        />
      </Grid>
      <Grid xs={2}>
        <Controller
          name="total"
          control={control}
          render={({ field }) => (
            <TextField
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              {...field}
              fullWidth
              id="total"
              label="Total"
              variant="filled"
              error={!!errors.total}
              helperText={errors.total?.message}
            />
          )}
        />
      </Grid>
      <Grid xs={1}>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default observer(AddNewItemForm);
