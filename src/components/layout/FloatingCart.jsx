import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark,faAngleUp,faAngleDown} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import FloatingCartItem from "./FloatingCartItem";
const FloatingCart = ({ itemCount = 5 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
 const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Jesus Christ Icon",
      price: 120,
      image:
        "https://s.turbifycdn.com/aah/yhst-47912705652979/jesus-christ-framed-icon-x4817-23.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Organic Cotton Scarf",
      price: 35,
      image: "/assets/products/scarf.jpg",
      quantity: 2,
    },
    {
      id: 3,
      name: "Jesus Christ Icon",
      price: 120,
      image:
        "https://s.turbifycdn.com/aah/yhst-47912705652979/jesus-christ-framed-icon-x4817-23.jpg",
      quantity: 1,
    },
    {
      id: 5,
      name: "Jesus Christ Icon",
      price: 120,
      image:
        "https://s.turbifycdn.com/aah/yhst-47912705652979/jesus-christ-framed-icon-x4817-23.jpg",
      quantity: 1,
    },
    {
      id: 6,
      name: "Jesus Christ Icon",
      price: 120,
      image:
        "https://s.turbifycdn.com/aah/yhst-47912705652979/jesus-christ-framed-icon-x4817-23.jpg",
      quantity: 1,
    },
  ]);
    const [isLoading, setIsLoading] = useState(true);
   const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Backdrop overlay with fade */}
      <div
  className={`fixed inset-0 backdrop-blur-sm  transition-opacity duration-300 z-60 ${
    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
  onClick={() => setOpen(false)}
/>


      <div
        ref={ref}
        className="fixed bottom-10 right-10 z-60 hidden sm:hidden md:block lg:block"
      >
        {/* Cart Button */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open cart"
          className="relative bg-primary-600 hover:bg-accent-700 hover:cursor-pointer z-50 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition"
        >
          <FontAwesomeIcon icon={open?faAngleDown:faAngleUp} className="text-2xl" />
          
        </button>

        {/* Dropdown panel */}
       <div
  className={`absolute bottom-24  flex flex-col-reverse items-center gap-4
    transform transition-all duration-300 ease-in-out origin-bottom-right
    ${open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
           : "opacity-0 translate-y-10 scale-95 pointer-events-none"}`}
>
           <button
         
          className="relative bg-primary-600 hover:bg-accent-700 hover:cursor-pointer z-50  text-white rounded-full w-16 h-16 flex items-center pb-5 justify-center shadow-lg transition"
        >
          <FontAwesomeIcon icon={open?faXmark:faPlus} className="text-2xl" />
          
        </button>
        <button
         
          className="relative bg-primary-600 hover:bg-accent-700 hover:cursor-pointer z-50  text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition"
        >
          <FontAwesomeIcon icon={open?faXmark:faPlus} className="text-2xl" />
          
        </button>
        </div>
      </div>
    </>
  );
};

export default FloatingCart;
