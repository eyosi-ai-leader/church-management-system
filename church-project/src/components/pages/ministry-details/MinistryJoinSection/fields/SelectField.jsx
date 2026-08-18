const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
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

      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : undefined
        }
        className={`
          w-full
          rounded-xl
          border
          bg-white
          px-4
          py-3
          text-gray-900
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
      >
        <option value="">
          Select an option
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

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

export default SelectField;