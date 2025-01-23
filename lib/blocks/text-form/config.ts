import * as Yup from 'yup';

export interface TextFormBlockConfig {
  title: string;
  label: string;
  buttonLabel: string;
  isAnonymous: boolean;
  items: ItemType[]
  // waitlistId: string;
}

export interface ItemType {
  // id: number;
  text: string;
  color: string
}

export const defaults: TextFormBlockConfig = {
  title: "New year's wishes!",
  label: 'Good Good Good',
  buttonLabel: 'Sent',
  isAnonymous: true,
  items: []
  // waitlistId: '',
};

export const TextFormBlockSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string().required('Please provide a label'),
  buttonLabel: Yup.string().required('Please provide a button label'),
  isAnonymous: Yup.boolean(),
  items: Yup.array()
  .of(
    Yup.object({
      text: Yup.string().required('Option text is required'),
      color: Yup.string(),
    })
  ),
  // waitlistId: Yup.string().required('Please provide your waitlist ID'),
});


// For ui component
export interface TextFormConfig {
  pageId: string
  email?: string
  text: string
  blockType: string
  option?: ItemType
}

export const defaultFormValues: TextFormConfig = {
  pageId: '',
  email: '',
  text: '',
  blockType: '',
  option: {text: '', color: ''}
}

export const TextFormSchema = Yup.object({
  pageId: Yup.string(),
  isAnonymous: Yup.boolean(),
  email: Yup.string()
    .email('Please enter a valid email')
    .when('isAnonymous', ([isAnonymous], schema) => {
      if (!isAnonymous) 
        return Yup.string().required('Email is required');
      return schema;
    }),
  text: Yup.string().required('Please enter some text'),
  option: Yup.object(),
});