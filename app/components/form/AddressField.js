import React from "react";
import Input from "@/app/utils/usealbe/Input";
import Section from "@/app/utils/usealbe/Section";

// Reusable Address Component
const AddressFields = ({
  title,
  address,
  onChange,
  prefix = "",
  className = "",
}) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <Section title={title} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Street Address"
          value={address.street}
          onChange={(e) => handleFieldChange("street", e.target.value)}
          icon={<i className="fas fa-map-marker-alt text-gray-400"></i>}
        />
        <Input
          label="Suburb"
          value={address.suburb}
          onChange={(e) => handleFieldChange("suburb", e.target.value)}
        />
        <Input
          label="State"
          value={address.state}
          onChange={(e) => handleFieldChange("state", e.target.value)}
        />
        <Input
          label="Postcode"
          value={address.postcode}
          onChange={(e) => handleFieldChange("postcode", e.target.value)}
        />
        <Input
          label="Country"
          value={address.country}
          onChange={(e) => handleFieldChange("country", e.target.value)}
          className="md:col-span-2"
          icon={<i className="fas fa-globe text-gray-400"></i>}
        />
      </div>
    </Section>
  );
};
export default AddressFields;
