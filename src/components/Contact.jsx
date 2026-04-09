import { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";

const Contact = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         try {
        await axios.post("http://localhost:8089/api/contact", form);

        // ✅ POPUP SUCCESS
        Swal.fire({
            title: "Success!",
            text: "Your message has been sent successfully.",
            icon: "success",
            confirmButtonColor: "#3085d6"
        });

        // Clear form
        setForm({
            name: "",
            email: "",
            subject: "",
            message: ""
        });

    } catch (error) {
        console.error(error);

        // ❌ ERROR POPUP
        Swal.fire({
            title: "Error!",
            text: "Failed to send message.",
            icon: "error"
        });
    }
};

    return(
        <div
            className="flex flex-col items-center justify-center min-h-screen py-12 bg-cover bg-center"
            style={{backgroundImage: "url('')"}}>

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-4xl font-bold text-center mb-6">Contact us</h1>
                <p className="text-gray-600 text-center mb-4">
                    We would love to hear from you! Please fill out the form below or contact us directly
                </p>

                {/* ✅ SUCCESS MESSAGE */}
                {success && (
                    <p className="text-green-600 text-center mb-4">{success}</p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input 
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input 
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    {/* ✅ ADDED SUBJECT FIELD */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Subject
                        </label>
                        <input 
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Message
                        </label>
                        <textarea 
                            rows="4"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                        Send Message
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    <div className="flex flex-col items-center space-y-2 mt-4">
                        <div className="flex items-center">
                            <FaPhone className="text-blue-500 mr-2"/>
                            <span className="text-gray-600">+91 91111 87878</span>
                        </div>

                        <div className="flex items-center">
                            <FaEnvelope className="text-blue-500 mr-2"/>
                            <span className="text-gray-600">cartify@gmail.com</span>
                        </div>

                        <div className="flex items-center">
                            <FaMapMarkedAlt className="text-blue-500 mr-2"/>
                            <span className="text-gray-600">KIIT, Town, INDIA</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Contact;