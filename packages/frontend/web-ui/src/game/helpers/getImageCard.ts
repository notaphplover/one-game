export type KindCard = 'draw' | 'wild' | 'reverse' | 'skip' | 'wildDraw4';

export function getImageCard(kind: KindCard): string {
  let imagePath: string;

  switch (kind) {
    case 'draw':
      imagePath = '/src/app/images/draw.ico';
      break;
    case 'wild':
      imagePath = '/src/app/images/wild.ico';
      break;
    case 'reverse':
      imagePath = '/src/app/images/reverse.ico';
      break;
    case 'skip':
      imagePath = '/src/app/images/skip.ico';
      break;
    case 'wildDraw4':
      imagePath = '/src/app/images/wildDraw4.ico';
      break;
  }

  return imagePath;
}
