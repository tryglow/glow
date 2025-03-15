export const prices = {
  development: {
    freeLegacy: 'price_1Qzm2LJKLsVNmaiRvZE2YGN4',
    premium: 'price_1QA7JEJKLsVNmaiRillvBTsw',
    team: 'price_1R1OgeJKLsVNmaiREVIN3JNL',
  },
  production: {
    freeLegacy: 'price_1QzlZJJKLsVNmaiRvRdmReAD',
    premium: 'price_1QA7KRJKLsVNmaiRZg6VcoKT',
    team: 'price_1R1OetJKLsVNmaiRaKuqiKPJ',
  },
};

export const isTeamPlan = (priceId: string) => {
  return (
    priceId === prices.development.team || priceId === prices.production.team
  );
};
