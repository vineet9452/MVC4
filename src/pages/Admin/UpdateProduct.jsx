import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams()
    const [categories, setCategories] = useState([]); // ✅ Array initialize किया
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(""); // ✅ सही state इस्तेमाल की
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const [id,setId] = useState('')
    const token = useSelector((state) => state.auth.token);

//get single product
const getSingleProduct=async()=>{
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${params.slug}`)
        setName(data.product.name)
        setId(data.product._id)
        setDescription(data.product.description)
        setPrice(data.product.price)
        setQuantity(data.product.quantity)
        setShipping(data.product.shipping)
        setCategory(data.product.category._id)
    } catch (error) {
        console.log(error);
    }
}
useEffect(()=>{
    getSingleProduct()
    //eslint-disable-next-line
},[])

    // Get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (data?.success) {
                setCategories(data.categories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    // update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category); // ✅ category सही सेट किया

            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/v1/product/update-product/${id}`,
                productData
            );
            if (data?.success) {
                toast.success("Product Updated Successfully");
                navigate("/dashboard/admin/products");
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

//delete a product
    const handleDelete=async()=>{
        try {
            let answer = window.prompt('Are you Sure want to delete this product ?');
            if(!answer) return;
            const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/product/delete-product/${id}`)
            toast.success('Product deleted successfully')
            navigate("/dashboard/admin/products");
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            
        }
    }

    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            {/* ✅ category के लिए सही state इस्तेमाल की */}
                            <select
                                className="form-select mb-3"
                                aria-label="Select category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                ):(
                                        <div className="text-center">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${id}`}
                                                alt="product_photo"
                                                height={"200px"}
                                                className="img img-responsive"
                                            />
                                        </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="Write a name"
                                    className="form-control"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    type="text"
                                    value={description}
                                    placeholder="Write a description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="Write a Price"
                                    className="form-control"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="Write a quantity"
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    className="form-select mb-3"
                                    id="shippingSelect"
                                    value={shipping ? "Yes":'No'}
                                    onChange={(e) => setShipping(e.target.value)} // ✅ state को अपडेट करें
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={  handleUpdate }>
                                    UPDATE PRODUCT
                                </button>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    DELETE PRODUCT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


export default UpdateProduct