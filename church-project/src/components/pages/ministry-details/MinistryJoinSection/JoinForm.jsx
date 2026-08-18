"use client";

import { useState } from "react";

import {Card} from "@/components/shared/Card";
import Button from "@/components/shared/Button";

import FieldRenderer from "./fields/FieldRenderer";

import {
  ministryApplicationFields,
} from "./formConfig";

import {
  initialFormState,
  validateApplication,
} from "./validation";

const JoinForm = ({ ministry, onSubmit }) => {
  const [formData, setFormData] =
    useState(initialFormState);

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors =
      validateApplication(formData);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ministrySlug: ministry.slug,
      ...formData,
    });
  };

  return (
    <Card className="mx-auto max-w-5xl p-8 md:p-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {ministryApplicationFields.map(
            (field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={
                  formData[field.name]
                }
                error={
                  errors[field.name]
                }
                onChange={
                  handleChange
                }
              />
            )
          )}
        </div>

        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreement"
              checked={
                formData.agreement
              }
              onChange={
                handleChange
              }
              className="mt-1 h-5 w-5 rounded border-gray-300"
            />

            <span className="text-sm leading-6 text-gray-600">
              I confirm that the
              information provided is
              accurate. I understand
              that submitting this
              application does not
              guarantee immediate
              acceptance into this
              ministry.
            </span>
          </label>

          {errors.agreement && (
            <p className="mt-2 text-sm text-red-600">
              {errors.agreement}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Submit Application
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default JoinForm;