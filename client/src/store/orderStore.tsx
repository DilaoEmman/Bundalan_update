import { action, makeObservable, observable } from "mobx";
import type { IRootStore } from "./rootStore";
import type { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

export default class OrderStore {
  BASE_URL = import.meta.env.VITE_APP_API_URL + "v1/orders";

  cartItems: any[] = []
  rootStore: IRootStore
  rowData: GridRowsProp[] = [];
  columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false, // Disable sorting
      filterable: false, // Disable filtering
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <IconButton
            component={Link}
            to={"view/" + params.row.id}
            color="info"
            size="medium"
          >
            <LocalPrintshopIcon />
          </IconButton>
        </Box>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    { field: "order_number", headerName: "Order Name", width: 200 },
    { field: "customer_name", headerName: "Customer Name", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 200 },
    { field: "price", headerName: "Price", width: 200 },
  ];

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      cartItems: observable,
      rowData: observable,
      columns: observable,
      setRowData: action,
      setCartItems: action,
      fetchList: action,
      getData: action,
      createData: action,
      addToCart: action,
      removeFromCart: action,
    });
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowsProp[]) {
    this.rowData = values;
  }
  setCartItems = (items: any[]) => {
      this.cartItems = items;
  }
  addToCart= async (value: any): Promise<boolean> => {
      this.cartItems.push(value);
      return Promise.resolve(true);
  }
  removeFromCart = async (index: any) =>  {
      this.cartItems.splice(index, 1);
  }

  calculateFinalPrice = (original: number, discount: number, quantity: number): number => {
        const finalPrice = original - (original *  discount / 100);
        return finalPrice*quantity
    }

  //   Api Calls
  fetchList = async () => {
    try {
            const response = await fetch(this.BASE_URL + '/list', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json', // You can adjust this header as needed
                }
            })
            const data = await response.json();
            if (data.error) {
                this.rootStore.handleError(response.status, `HTTP Request failed: ${response.status} ${response.statusText}`, data);
                return Promise.reject(data)
            } else {
                this.setRowData(data.data.orders);
                return Promise.resolve(data)
            }
        } catch (error: any) {
            this.rootStore.handleError(419, "Something went wrong!", error)
        }
  }

  // Create
  createData = async (orderData: any) => {
      try {
          const postDataProducts =[...this.cartItems].map((e: any)=>{
              return {
                  product_id: e.product.id,
                  quantity: e.quantity,
                  discount: e.discount,
              }
          })
          // Support for cash_received and change
          const formData = new FormData();
          formData.append("customer_id", orderData.customer?.id);
          if (orderData.cash_received !== undefined) {
            formData.append("cash_received", orderData.cash_received);
          }
          if (orderData.change !== undefined) {
            formData.append("change", orderData.change);
          }
          postDataProducts.forEach((item:any, i: number) => {
              Object.keys(item).map((key:any) => {
                  formData.append(`products[${i}][${key}]`, item[key]);
              });
          })
          const response = await fetch(this.BASE_URL, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${this.rootStore.authStore.token}`,
              },
              body: formData
          })

          const data = await response.json();
          if (data.error) {
              this.rootStore.handleError(response.status, data.message, data);
              return Promise.reject(data)
          } else {
              this.rootStore.alertStore.open({status: "success", message: data.message})
              return Promise.resolve(data)
          }
      } catch (error: any) {
          this.rootStore.handleError(419, "Something went wrong!", error)
      }
  }

  // View
  getData = async (id: number | string) => {
    try {

      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.rootStore.authStore.token}`,
          'Content-Type': 'application/json', // You can adjust this header as needed
        }
      })
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data)
      } else {
          const orderItems = data.data.order?.items.map((item:any) => {
              return {
                  product: {
                      label: item.product_name
                  }, 
                  quantity: item.product_quantity,
                  price: item.product_price,
                  discount: item.product_discount,
                  total: this.calculateFinalPrice(item.product_price,item.product_discount, item.product_quantity),
              }
            })
        this.setCartItems(orderItems);
        return Promise.resolve(data.data.order)
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error)
    }
  }
}
