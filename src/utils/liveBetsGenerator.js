const RANDOM_PHONE_SUFFIXES = [
  '784', '912', '453', '671', '230', '889', '341', '519', '126', '993',
  '402', '625', '738', '194', '852', '316', '547', '263', '901', '444',
];

const BET_AMOUNTS = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

export function generateInitialRoundBets(period) {
  const bets = [];
  const now = Date.now();
  const count = Math.floor(Math.random() * 5) + 8; // 8 to 12 initial bets

  for (let i = 0; i < count; i++) {
    const userSuffix =
      RANDOM_PHONE_SUFFIXES[Math.floor(Math.random() * RANDOM_PHONE_SUFFIXES.length)];
    const roll = Math.random();

    let choiceType = 'number';
    let choiceValue = '0';
    let choiceLabel = 'Number 0';

    if (roll < 0.5) {
      const num = Math.floor(Math.random() * 10);
      choiceType = 'number';
      choiceValue = String(num);
      choiceLabel = `Number ${num}`;
    } else if (roll < 0.75) {
      const col = ['green', 'violet', 'red'][Math.floor(Math.random() * 3)];
      choiceType = 'color';
      choiceValue = col;
      choiceLabel = col.charAt(0).toUpperCase() + col.slice(1);
    } else {
      const sz = Math.random() > 0.5 ? 'big' : 'small';
      choiceType = 'size';
      choiceValue = sz;
      choiceLabel = sz === 'big' ? 'Big' : 'Small';
    }

    const amount = BET_AMOUNTS[Math.floor(Math.random() * BET_AMOUNTS.length)];

    bets.push({
      id: `${period}-init-${i}-${Math.random().toString(36).substr(2, 5)}`,
      period,
      userName: `User***${userSuffix}`,
      isUser: false,
      choiceType,
      choiceValue,
      choiceLabel,
      amount,
      timestamp: now - (count - i) * 1200,
    });
  }

  bets.sort((a, b) => b.amount - a.amount);
  return bets;
}

export function generateSingleIncomingBet(period) {
  const userSuffix =
    RANDOM_PHONE_SUFFIXES[Math.floor(Math.random() * RANDOM_PHONE_SUFFIXES.length)];
  const roll = Math.random();

  let choiceType = 'number';
  let choiceValue = '0';
  let choiceLabel = 'Number 0';

  if (roll < 0.55) {
    const num = Math.floor(Math.random() * 10);
    choiceType = 'number';
    choiceValue = String(num);
    choiceLabel = `Number ${num}`;
  } else if (roll < 0.8) {
    const col = ['green', 'violet', 'red'][Math.floor(Math.random() * 3)];
    choiceType = 'color';
    choiceValue = col;
    choiceLabel = col.charAt(0).toUpperCase() + col.slice(1);
  } else {
    const sz = Math.random() > 0.5 ? 'big' : 'small';
    choiceType = 'size';
    choiceValue = sz;
    choiceLabel = sz === 'big' ? 'Big' : 'Small';
  }

  const amount = BET_AMOUNTS[Math.floor(Math.random() * BET_AMOUNTS.length)];

  return {
    id: `${period}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    period,
    userName: `User***${userSuffix}`,
    isUser: false,
    choiceType,
    choiceValue,
    choiceLabel,
    amount,
    timestamp: Date.now(),
  };
}
