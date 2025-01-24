import * as Yup from 'yup';

export interface SelectionFormBlockConfig {
  title: string;
  label: string;
  buttonLabel: string;
  items: ItemType[]
  // waitlistId: string;
}

export interface ItemType {
  // id: number;
  text: string;
  color: string
}

export const defaults: SelectionFormBlockConfig = {
  title: "What's the best snack of all time?",
  label: 'Nom Nom Nom',
  buttonLabel: 'Sent',
  items: [{
    text: 'Good', color: '#F4393C'
  }]
  // waitlistId: '',
};

export const SelectionFormBlockSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string().required('Please provide a label'),
  buttonLabel: Yup.string().required('Please provide a button label'),
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
export interface SelectionFormConfig {
  pageId: string
  email?: string
  text?: string
  blockType: string
  option: ItemType
}

export const defaultFormValues: SelectionFormConfig = {
  pageId: '',
  email: '',
  text: '',
  blockType: '',
  option: {text: '', color: ''}
}

export const SelectionFormSchema = Yup.object({
  pageId: Yup.string(),
  email: Yup.string(),
  text: Yup.string(),
  option: Yup.object({
    text: Yup.string().required('Please select an option'),
    color: Yup.string().required('Option color is required'),
  }).required('Please select an option'),
});