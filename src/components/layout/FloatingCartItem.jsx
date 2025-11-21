import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const FloatingCartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div
      className="flex items-center gap-4 text-sm py-2 px-3 rounded-2xl backdrop-blur-sm bg-white border border-[#D4C9B1]/50 shadow-md"
    >
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-15 h-15 object-cover rounded-xl shadow-md  border border-[#E6DCC9]"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-[#5E4B3C]">{item.name}</h3>
        <p className="text-[#7A6B54]">${item.price}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onQuantityChange(item.id, -1)}
            className="bg-[#E6DCC9] text-[#5E4B3C] rounded-md px-2 py-1 hover:bg-[#D4C9B1] transition-colors"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="px-3 font-medium">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, 1)}
            className="bg-[#E6DCC9] text-[#5E4B3C] rounded-md px-2 py-1 hover:bg-[#D4C9B1] transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 mr-2" 
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default FloatingCartItem;
