import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from '../../hooks/useTelegram';

interface FormDataState {
  product_name: string;
  ASIN: string;
  phone_number: string;
  FBA: boolean;
  FBM: boolean;
  FBA_details: {
    number_of_units: string;
    SET: boolean;
    NOT_SET: boolean;
    number_of_units_in_set: string;
    number_of_sets: string;
    comment: string;
  };
  FBM_details: {
    number_of_units: string;
    SET: boolean;
    NOT_SET: boolean;
    comment: string;
  };
}

const initialFormData: FormDataState = {
  product_name: '',
  ASIN: '',
  phone_number: '',
  FBA: false,
  FBM: false,
  FBA_details: {
    number_of_units: '',
    SET: false,
    NOT_SET: false,
    number_of_units_in_set: '',
    number_of_sets: '',
    comment: '',
  },
  FBM_details: {
    number_of_units: '',
    SET: false,
    NOT_SET: false,
    comment: '',
  },
};

export const Form_2: React.FC = () => {
  const { tg } = useTelegram();
  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  const onSendData = useCallback(() => {
    tg.sendData(JSON.stringify(formData));
  }, [formData]); // eslint-disable-line

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);
    return () => tg.offEvent('mainButtonClicked', onSendData);
  }, [onSendData]); // eslint-disable-line

  useEffect(() => {
    tg.MainButton.setParams({ text: 'Submit' });
    if (!formData.product_name || !formData.ASIN) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [formData.product_name, formData.ASIN]); // eslint-disable-line

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >,
  // ) => {
  //   const { name, value, type } = e.target;
  //   const isCheckbox = type === 'checkbox';
  //   const target = e.target as HTMLInputElement;

  //   if (name.includes('.')) {
  //     const keys = name.split('.');
  //     setFormData((prev: FormDataState) => ({
  //       ...prev,
  //       [keys[0]]: {
  //         ...prev[keys[0]],
  //         [keys[1]]: isCheckbox ? target.checked : value,
  //       },
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: isCheckbox ? target.checked : value,
  //     }));
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const target = e.target as HTMLInputElement;

    // Splitting the key path
    const keys = name.split('.');

    setFormData((prev: FormDataState) => {
      // Handle mutual exclusivity for FBA and FBM
      if (keys.length === 1 && (name === 'FBA' || name === 'FBM')) {
        return {
          ...prev,
          FBA: name === 'FBA' ? target.checked : false, // Set FBA true if FBA was checked, else false
          FBM: name === 'FBM' ? target.checked : false, // Set FBM true if FBM was checked, else false
        };
      }

      // Check if we are dealing with nested keys
      if (keys.length === 2) {
        const [firstKey, secondKey] = keys as [keyof FormDataState, string];
        const firstObj = prev[firstKey];

        // Check if firstKey correctly indexes to an object
        if (
          typeof firstObj === 'object' &&
          firstObj !== null &&
          !Array.isArray(firstObj)
        ) {
          return {
            ...prev,
            [firstKey]: {
              ...firstObj,
              [secondKey]: isCheckbox ? target.checked : value,
            },
          };
        }
      }

      // Handle non-nested keys
      return {
        ...prev,
        [name]: isCheckbox ? target.checked : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendData();
  };

  return (
    <div className='form'>
      <h3>Product Form</h3>
      <form onSubmit={handleSubmit} className='form'>
        <label className='label'>
          Product Name:
          <input
            id='product_name'
            type='text'
            name='product_name'
            value={formData.product_name}
            onChange={handleChange}
            placeholder='e.g. iPhone 12'
            className='input'
          />
        </label>
        <label className='label'>
          ASIN:
          <input
            id='ASIN'
            type='text'
            name='ASIN'
            value={formData.ASIN}
            onChange={handleChange}
            placeholder='e.g. B08Y5V8JLH'
            className='input'
          />
        </label>
        <label className='label'>
          Phone Number:
          <input
            id='phone_number'
            type='text'
            name='phone_number'
            value={formData.phone_number}
            onChange={handleChange}
            placeholder='Phone Number'
            className='input'
          />
        </label>
        <div>
          <label className='label is-medium'>
            <input
              type='checkbox'
              name='FBA'
              checked={formData.FBA}
              onChange={handleChange}
              className='checkbox'
            />{' '}
            FBA
          </label>
          <label className='label is-medium'>
            <input
              type='checkbox'
              name='FBM'
              checked={formData.FBM}
              onChange={handleChange}
              className='checkbox'
            />{' '}
            FBM
          </label>
        </div>
        {formData.FBA && (
          <div>
            <input
              type='number'
              name='FBA_details.number_of_units'
              value={formData.FBA_details.number_of_units}
              onChange={handleChange}
              placeholder='Number of Units'
              className='input'
            />
            <input
              type='checkbox'
              name='FBA_details.SET'
              checked={formData.FBA_details.SET}
              onChange={handleChange}
              className='input'
              placeholder='SET'
            />{' '}
            <legend className='label'>SET</legend>
            {formData.FBA_details.SET && (
              <div>
                <input
                  type='number'
                  name='FBA_details.number_of_units_in_set'
                  value={formData.FBA_details.number_of_units_in_set}
                  onChange={handleChange}
                  placeholder='Units in Set'
                  className='input'
                />
                <input
                  type='number'
                  name='FBA_details.number_of_sets'
                  value={formData.FBA_details.number_of_sets}
                  onChange={handleChange}
                  placeholder='Number of Sets'
                  className='input'
                />
              </div>
            )}
            <input
              type='text'
              name='FBA_details.comment'
              value={formData.FBA_details.comment}
              onChange={handleChange}
              placeholder='Comment'
              className='input'
            />
          </div>
        )}
        {formData.FBM && (
          <div>
            <input
              type='number'
              name='FBM_details.number_of_units'
              value={formData.FBM_details.number_of_units}
              onChange={handleChange}
              placeholder='Number of Units'
              className='input'
            />
            <input
              type='text'
              name='FBM_details.comment'
              value={formData.FBM_details.comment}
              onChange={handleChange}
              placeholder='Comment'
              className='input'
            />
          </div>
        )}
        {/* <button type='submit'>Submit</button> */}
      </form>
    </div>
  );
};
