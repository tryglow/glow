import { Form, Formik, FormikHelpers, FieldArray, Field } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormField } from '@/components/FormField';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { ItemType, SelectionFormBlockConfig, SelectionFormBlockSchema } from './config';
import dragIcon from '@/app/assets/ui/drag.svg';
import Image from 'next/image';
import { useState } from 'react';
import { Icon } from "@iconify/react";

const colors = ["#F4393C", "#FF4182", "#3293FB", "#20D800", "#FA5DFF", "#F9E552", "#FF7E38", "#24FBFF"]

const newItem = {
  id: 0,
  text: '',
  color: colors[0],
}

const CustomColorDropdown = ({ value, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div onClick={() => setIsOpen(!isOpen)} className="relative bg-white h-9 flex items-center justify-between rounded px-2 border gap-2">
      {/* Display Selected Color */}
      <div
        className="w-6 h-6 rounded-full border cursor-pointer"
        style={{ backgroundColor: value }}
      ></div>

      <Icon icon="dashicons:arrow-down" width="20" height="20" style={{ transform: isOpen ? 'rotate(180deg) translateX(-2px)' : 'rotate(0deg)'}} />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg p-2 z-10">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => handleSelect(color)}
              className="w-6 h-6 rounded-full mb-1 cursor-pointer"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};


export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<SelectionFormBlockConfig>) {

  const onSubmit = async (
    values: SelectionFormBlockConfig,
    { setSubmitting }: FormikHelpers<SelectionFormBlockConfig>
  ) => {
    console.log('values => ', values);
    
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        title: initialValues?.title ?? '',
        label: initialValues?.label ?? '',
        buttonLabel: initialValues?.buttonLabel ?? '',
        items: initialValues?.items ?? [{text: 'Good', color: colors[0]}]
        // waitlistId: initialValues?.waitlistId ?? '',
      }}
      validationSchema={SelectionFormBlockSchema}
      onSubmit={onSubmit}
      enableReinitialize={false}
    >
      {({ isSubmitting, values, setFieldValue, errors }) => (
        <Form className="w-full flex flex-col gap-2">
          <FormField
            label="Title"
            name="title"
            id="title"
            error={errors.title}
          />
          <FormField
            label="Label"
            name="label"
            id="label"
            error={errors.label}
          />
          <FormField
            label="Button label"
            name="buttonLabel"
            id="buttonLabel"
            error={errors.buttonLabel}
          />

          {/* Dynamic Items */}
          <FieldArray name="items">
            {({ push, remove }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {values.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mt-2">
                      <Image src={dragIcon} width={7} height={12} alt="" />
                      {/* Color Selector */}
                      <CustomColorDropdown
                        value={item.color}
                        onChange={(color: string) => setFieldValue(`items.${index}.color`, color)}
                      />

                      {/* Text Field */}
                      <Field
                        type="text"
                        name={`items.${index}.text`}
                        placeholder="Enter option text"
                        className="block h-9 flex-1 px-2 py-1 border-none outline-none ring-1 ring-inset ring-input focus:ring-gray-500 rounded text-sm"
                      />

                      {/* Delete Button */}
                      {index > 0 && <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Icon icon="fluent:delete-20-regular" width={20} height={20} />
                      </button>}
                    </div>
                    {/* Per-Item Errors */}
                    <div className="text-red-500 text-xs mt-2 ml-24">
                      {errors.items &&
                        errors.items[index] &&
                        typeof errors.items[index] === 'object' &&
                        Object.values(errors.items[index] as Record<string, string>).map(
                          (error, errorIndex) => <div key={errorIndex}>{error}</div>
                        )}
                    </div>
                  </div>
                ))}

                {/* Add Item Button */}
                <button
                  type="button"
                  onClick={() => push({ text: '', color: colors[0] })}
                  className="mt-3 py-1 px-4 bg-white text-[#1d6e35] border font-semibold shadow rounded text-sm"
                >
                  {values?.items?.length > 0 ? 'Add another option' : 'Add option'}
                </button>
              </div>
            )}
          </FieldArray>

          {/* Custom options */}
          {/* <div>
            <p>Option</p>
            {items?.length > 0 && items.map((item, index) => <div key={index} className='flex items-center mt-2'>
              <Image
                src={dragIcon}
                width={7}
                height={12}
                alt=""
              />
              <select name={`color-${item.id}`} value={item?.color} onChange={(e) => handleColorChange(index, e.target.value)} className='mr-2 ml-1.5 py-0 h-7 border-none ring-1 ring-input focus:ring-gray-500 outline-none rounded text-xs'>
                {colors.map(color => <option key={color} value={color}>{color}</option>)}
              </select>
              <input type='text' placeholder='Enter option' className='block outline-none border-none py-1.5 ring-1 ring-inset focus:ring-inset ring-input placeholder:text-gray-400 focus:ring-gray-500 text-xs h-[30px] px-3 rounded bg-white mr-2' name={`optionText-${item.id}`} onChange={(e) => handleOptionChange(index, e.target.value)} value={item?.text} />
              <Icon icon="fluent:delete-20-regular" width="20" height="20" />
            </div>
            )}
            <button type='button' className='py-1 px-6 border rounded my-3 text-sm font-medium text-[#1d6e35] bg-white' onClick={handleClick}>{items?.length > 0 ? 'Add another item' : 'Add item'}</button>

          </div> */}


          {/* <FormField
            label="Waitlist ID"
            name="waitlistId"
            id="waitlistId"
            error={errors.waitlistId}
          />
          <span className="text-xs text-black/70 -mt-2 mb-3">
            You can find this in your settings on getwaitlist.com
          </span> */}

          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              ← Cancel
            </Button>
            <Button type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
