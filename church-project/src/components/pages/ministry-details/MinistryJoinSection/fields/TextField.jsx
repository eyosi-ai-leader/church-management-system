const TextField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id || name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : undefined
        }
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-gray-900
          placeholder:text-gray-400
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-primary
          ${
            error
              ? "border-red-500"
              : "border-gray-300"
          }
        `}
      />

      {error && (
        <p
          id={`${name}-error`}
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default TextField;