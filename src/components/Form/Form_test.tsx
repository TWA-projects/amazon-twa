import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from '../../hooks/useTelegram';

export const TestForm: React.FC = () => {
  const { tg } = useTelegram();
  const [name, setName] = useState<string>('');
  const [asin, setAsin] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [sex, setSex] = useState<string>('female');

  const onSendData = useCallback(() => {
    const data = {
      name,
      asin,
      sex,
    };

    tg.sendData(JSON.stringify(data));
  }, [asin, name, sex]); // eslint-disable-line

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);

    return () => {
      tg.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData]); // eslint-disable-line

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Submit',
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!name || !asin) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [name, asin]); // eslint-disable-line

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onChangeAsin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAsin(e.target.value);
  };
  const onChangeSex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSex(e.target.value);
  };

  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div className='form'>
      <h3>Form</h3>

      <form className='form'>
        {/* <label htmlFor="name">Name</label> */}
        <label htmlFor='name' className='label'>
          Product Name:
        </label>
        <input
          className='input'
          id='name'
          type='text'
          value={name}
          onChange={onChangeName}
          placeholder='e.g. iPhone 12'
        />

        <label htmlFor='asin' className='label'>
          ASIN:
        </label>
        <input
          className='input'
          type='text'
          id='asin'
          value={asin}
          onChange={onChangeAsin}
          placeholder='e.g. B08Y5V8JLH'
        />

        <label htmlFor='phone' className='label'>
          Phone Number:
        </label>
        <input
          className='input'
          type='tel'
          id='phone'
          value={phone}
          onChange={onChangePhone}
          placeholder='e.g. 123456789'
        />

        <fieldset>
          <legend className='legend'>Return policy:</legend>
          <label>
            <input type='radio' name='FBA' value='FBA' />
            FBA
          </label>
          <label>
            <input type='radio' name='FBA' value='FBM' />
            FBM
          </label>
        </fieldset>

        <select className={'select'} value={sex} onChange={onChangeSex}>
          <option value={'female'}>Female</option>
          <option value={'male'}>Male</option>
        </select>

        {/* <label htmlFor="message">Message</label>
        <textarea name="message" id="message" cols={30} rows={10}></textarea> */}
      </form>
    </div>
  );
};
