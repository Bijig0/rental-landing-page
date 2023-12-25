// @ts-ignore
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import React, { useState } from 'react';
import type { Form } from '~/types';

type Props = Omit<Form, 'button'> & { children: any };

const EmailForm = (props: Props) => {
  const { inputs, textarea, disclaimer, children, description } = props;
  const [emailJSResponse, setEmailJSResponse] = useState<EmailJSResponseStatus>({ text: '', status: -1 });
  const isEmailSent = emailJSResponse.status !== -1;
  const isEmailSendSuccess = emailJSResponse.status === 200;
  const isEmailSendFailed = emailJSResponse.status !== 200 && emailJSResponse.status !== -1;
  console.log({ isEmailSent, isEmailSendSuccess, isEmailSendFailed });
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
    console.log('run');
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    try {
      const response = await emailjs.sendForm('service_svuswb5', 'template_yknvvm8', form, '1QhUBMpFGH856b2Qr');
      console.log({ response });
      setEmailJSResponse(response);
    } catch (error) {
      const emailJSError = error as EmailJSResponseStatus;
      setEmailJSResponse(emailJSError);
    }
  };

  const renderAlert = () => {
    if (!isEmailSent) {
      return null;
    }
    if (isEmailSendSuccess) {
      return (
        <>
          <div className="mt-4"></div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Email sent successfully! </strong>
            <span className="block sm:inline">A representative will be in touch soon</span>
          </div>
        </>
      );
    } else if (isEmailSendFailed) {
      return (
        <>
          <div className="mt-4"></div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">An error occurred </strong>
            <span className="block sm:inline">
              Error: {emailJSResponse.text} Status Code: {emailJSResponse.status}
            </span>
            <br />
            <span className="block sm:inline">Please report this to the admin admin@swiftqu.com</span>
          </div>
        </>
      );
    }
  };

  return (
    <form id="email-form" onSubmit={onSubmit}>
      {inputs &&
        inputs.map(
          ({ type = 'text', name, label = '', autocomplete = 'on', placeholder = '' }) =>
            name && (
              <div className="mb-6">
                {label && (
                  <label htmlFor={name} className="block text-sm font-medium">
                    {label}
                  </label>
                )}
                <input
                  type={type}
                  name={name}
                  id={name}
                  autoComplete={autocomplete}
                  placeholder={placeholder}
                  className="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
                />
              </div>
            )
        )}

      {textarea && (
        <div>
          <label htmlFor="textarea" className="block text-sm font-medium">
            {textarea.label}
          </label>
          <textarea
            id="textarea"
            name="textarea"
            rows={textarea.rows ? textarea.rows : 4}
            placeholder={textarea.placeholder}
            className="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
          />
        </div>
      )}

      {disclaimer && (
        <div className="mt-3 flex items-start">
          <div className="flex mt-0.5">
            <input
              id="disclaimer"
              name="disclaimer"
              type="checkbox"
              className="cursor-pointer mt-1 py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="disclaimer" className="cursor-pointer select-none text-sm text-gray-600 dark:text-gray-400">
              {disclaimer.label}
            </label>
          </div>
        </div>
      )}

      {children && <div className="mt-10 grid">{children}</div>}

      {description && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      )}
      {renderAlert()}
    </form>
  );
};

export default EmailForm;
