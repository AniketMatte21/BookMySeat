import React, { useState, useEffect } from "react";
import { FiMail, FiUser, FiPhone, FiEdit2, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function ProfileSection({ userProfile, onUpdateProfile, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        email: userProfile.email || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        contactNumber: userProfile.contactNumber || "",
      });
      setHasChanges(false);
    }
  }, [userProfile]);

  const handleStartEdit = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    setTempValue(currentValue || "");
  };

  const handleSaveField = (fieldKey) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: tempValue.trim() }));
    setEditingField(null);
    setHasChanges(true);
  };

  const handleCancelField = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleKeyDown = (e, fieldKey) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveField(fieldKey);
    } else if (e.key === "Escape") {
      handleCancelField();
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      }
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label, fieldKey, icon, isEditable = true) => {
    const value = formData[fieldKey];
    const isMissing = !value || value.trim() === "";
    const isCurrentlyEditing = editingField === fieldKey;

    return (
      <div className="relative flex flex-col gap-1.5 p-3.5 sm:p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-slate-700/60 transition-all duration-200">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          {icon}
          {label}
        </span>

        <div className="flex items-center justify-between min-h-[38px] mt-0.5">
          {!isEditable ? (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-slate-200 text-xs sm:text-sm font-medium truncate">
                {value || "—"}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50 shrink-0">
                Verified
              </span>
            </div>
          ) : isCurrentlyEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type={fieldKey === "contactNumber" ? "tel" : "text"}
                value={tempValue}
                autoFocus
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, fieldKey)}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full min-w-0 text-xs sm:text-sm bg-slate-800/90 border border-indigo-500/60 rounded-lg px-2.5 py-1.5 text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="button"
                onClick={() => handleSaveField(fieldKey)}
                className="p-1.5 sm:p-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
                title="Done"
              >
                <FiCheck size={14} />
              </button>
              <button
                type="button"
                onClick={handleCancelField}
                className="p-1.5 sm:p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                title="Cancel"
              >
                <FiX size={14} />
              </button>
            </div>
          ) : isMissing ? (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-[11px] sm:text-xs flex items-center gap-1.5 text-amber-400/90 bg-amber-500/10 px-2 sm:px-2.5 py-1 rounded-md border border-amber-500/20 truncate">
                <FiAlertCircle size={13} className="shrink-0" />
                <span className="truncate">Update your {label.toLowerCase()}</span>
              </span>
              <button
                type="button"
                onClick={() => handleStartEdit(fieldKey, "")}
                className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors shrink-0"
              >
                Add <FiEdit2 size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-slate-200 text-xs sm:text-sm font-medium truncate">
                {value}
              </span>
              <button
                type="button"
                onClick={() => handleStartEdit(fieldKey, value)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                title={`Edit ${label}`}
              >
                <FiEdit2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    // 25% spacing on left and right for laptops (lg), fluid padding for mobile/tablets
    <section className="w-full my-6 sm:my-8 px-4 sm:px-8 lg:px-[25%]">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-5 sm:p-8 shadow-2xl transition-all">
        {/* Glow Accents */}
        <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative flex items-start justify-between border-b border-slate-800/80 pb-4 sm:pb-5 mb-5 sm:mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Personal Profile
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Manage your personal identification and seat booking credentials.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Close profile"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinalSubmit} className="relative space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {renderField("Email Address", "email", <FiMail size={14} />, false)}
            {renderField("Contact Number", "contactNumber", <FiPhone size={14} />, true)}
            {renderField("First Name", "firstName", <FiUser size={14} />, true)}
            {renderField("Last Name", "lastName", <FiUser size={14} />, true)}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center pt-4 mt-5 sm:mt-6 border-t border-slate-800/60">
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 shadow-md ${
                hasChanges
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-indigo-500/20 active:scale-95"
                  : "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/40"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}