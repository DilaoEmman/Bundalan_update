import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../store/rootStore";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  category_id: Yup.string().required("Category is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Minimum price is 0"),
  stock: Yup.number()
    .required("Stock is required")
    .min(0, "Minimum stock is 0"),
  image: Yup.mixed()
    .test("fileType", "Unsupported file format", (value: any) => {
      if (value && value !== "") {
        const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];
        return supportedFormats.includes(value.type);
      }
      return true;
    })
    .test("fileSize", "File size is too large (max: 5000KB)", (value: any) => {
      if (value && value !== "") {
        return value.size <= 5000000;
      }
      return true;
    }),
});

const ProductEdit = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const {
    rootStore: { productStore },
  } = useStore();
  const { getData, initForm, updateData } = productStore;
  const { id } = useParams();

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      category_id: "",
      price: 0,
      stock: 0,
      image: "",
    },
  });

  const watchedImage = watch("image");

  // This handles the image preview logic
  const getDisplayImage = () => {
    if (watchedImage && watchedImage instanceof File) {
      return URL.createObjectURL(watchedImage);
    }
    if (existingImage) {
      if (existingImage.startsWith("http")) return existingImage;
      const storageUrl =
        import.meta.env.VITE_STORAGE_URL?.replace(/\/$/, "") || "/storage";
      return `${storageUrl}/${existingImage.replace(/^\/+/, "")}`;
    }
    return null;
  };

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "image") {
            if (data[key] && data[key] instanceof File) {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        });
        const resData = await updateData(id, formData);
        if (resData) {
          reset();
          navigate("..");
        }
      }
    } catch (error: any) {
      Object.keys(error?.data).map((e: any) => {
        setError(e, {
          type: "manual",
          message: error?.data[e],
        });
      });
    }
  };

  const initFormData = async () => {
    try {
      const resData = await initForm();
      setCategories(resData.data.categories);

      if (id) {
        const resData = await getData(id);
        let { image, category, ...formData } = resData.data.product;

        if (image) {
          setExistingImage(image);
        }

        reset(formData);
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  useEffect(() => {
    initFormData();
    // eslint-disable-next-line
  }, [id]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" align="center" mb={2}>Edit Product</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="name"
                  label="Product Name"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  id="category_id"
                  label="Category"
                  variant="filled"
                  error={!!errors.category_id}
                  helperText={errors.category_id?.message}
                  sx={{ mb: 2 }}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="price"
                  label="Price"
                  variant="outlined"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="stock"
                  label="Stock"
                  variant="outlined"
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            {/* IMAGE BELOW STOCK */}
            <Box sx={{ mb: 2 }}>
              {getDisplayImage() && (
                <Card sx={{ maxWidth: 200, my: 1 }}>
                  <CardMedia
                    component="img"
                    alt="Product"
                    sx={{ width: 200, height: 200, objectFit: "cover", mx: "auto" }}
                    image={getDisplayImage()}
                  />
                </Card>
              )}
            </Box>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="image"
                  type="file"
                  variant="filled"
                  inputProps={{ accept: "image/jpeg,image/png,image/jpg" }}
                  onChange={(e: any) => {
                    if (e.target.files && e.target.files.length > 0) {
                      field.onChange(e.target.files[0]);
                    } else {
                      field.onChange("");
                    }
                  }}
                  error={!!errors.image}
                  helperText={errors.image?.message}
                  sx={{ my: 2 }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="success"
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            color="primary"
          >
            Back
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default observer(ProductEdit);
