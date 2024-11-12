import * as Yup from 'yup';

export interface AccordionBlockConfig {
  accTitle: string;
  accContent: string;
}

export const defaults: AccordionBlockConfig = {
  accTitle: 'Is it accessible?',
  accContent: "Yes. It adheres to the WAI-ARIA design pattern.",
};

export const AccordionSchema = Yup.object().shape({
  accTitle: Yup.string().required('Please provide title'),
  accContent: Yup.string().required('Please provide some content'),
});