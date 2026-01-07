import { useEffect, useState } from "react";

export default function Dialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    category: "",
    description: "",
    latitude: "",
    longitude: "",
    city: "",
    area: "",
  });
  const [err, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function showError(value) {
    setError(value);

    setTimeout(() => {
      setError("");
    }, 3000);
  }

  function validateForm(form) {
    if (
      !form.category ||
      !form.description ||
      !form.city ||
      !form.area ||
      !form.latitude ||
      !form.longitude
    )
      return "Please fill all the required fields";
    return "";
  }

  function validateDesc(value) {
    if (value.length > 200) return "Description must be under 200 characters";
    return;
  }

  //Broken
  function validateFloat(value) {
    if (value === "" || value === null || value === undefined) {
      return "Value is required";
    }

    const floatRegex = /^-?\d+(\.\d+)?$/;

    if (!floatRegex.test(value)) {
      return "Must be a valid decimal number";
    }

    return 0;
  }

  function checkFirstCapitalLetter(value) {
    if (!value) return "";

    const firstChar = value.trim().charAt(0);
    if (firstChar !== firstChar.toUpperCase()) {
      return "First letter must be capital";
    }
    return "";
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formError = validateForm(form);
    if (formError) {
      showError(formError);
      return;
    }

    const cityError = checkFirstCapitalLetter(form.city);
    if (cityError) {
      showError(cityError);
      return;
    }

    const areaError = checkFirstCapitalLetter(form.area);
    if (areaError) {
      showError(areaError);
      return;
    }

    const descError = validateDesc(form.description);
    if (descError) {
      showError(descError);
      return;
    }

    const latError = validateFloat(form.latitude);
    if (latError) {
      showError(latError);
      return;
    }

    const lngError = validateFloat(form.longitude);
    if (lngError) {
      showError(lngError);
      return;
    }

    const correctedForm = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };

    onSubmit(correctedForm);
    setForm({
      category: "",
      description: "",
      latitude: "",
      longitude: "",
      city: "",
      area: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Report your complaint</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {err && (
            <div
              className="
            w-full px-4 py-2 text-sm
            rounded-md
            bg-red-600/70 text-white
            border border-red-800 border-dashed
            transition-all duration-300 ease-out
            animate-slideFade
          "
            >
              {err}
            </div>
          )}

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Waste">Waste Management</option>
              <option value="Water">Water</option>
              <option value="Roads">Roads</option>
              <option value="Pollution">Pollution</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue clearly"
              value={form.description}
              onBlur={(e) => {
                const error = validateDesc(e.target.value);
                if (error) showError(error);
              }}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder="e.g. 28.6139"
                value={form.latitude}
                onChange={handleChange}
                onBlur={(e) => {
                  const error = validateFloat(e.target.value);
                  if (error) setError(error);
                }}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder="e.g. 77.2090"
                value={form.longitude}
                onBlur={(e) => {
                  const error = validateFloat(e.target.value);
                  if (error) setError(error);
                }}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              onBlur={(e) => {
                const error = checkFirstCapitalLetter(e.target.value);
                if (error) showError(error);
              }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Area */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Area / Locality <span className="text-red-500">*</span>
            </label>
            <input
              name="area"
              placeholder="Area / Locality"
              value={form.area}
              onBlur={(e) => {
                const error = checkFirstCapitalLetter(e.target.value);
                if (error) showError(error);
              }}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-500">
            Fields marked with <span className="text-red-500">*</span> are
            required
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              Submit Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
