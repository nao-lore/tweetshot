interface Props {
  exportCount: number;
}

export function GreenFootprint({ exportCount }: Props) {
  // Rough estimate: generating an image client-side uses ~0.001g CO2 vs cloud rendering ~0.01g
  const savedCO2 = (exportCount * 0.009).toFixed(2); // grams saved vs cloud

  if (exportCount < 5) return null;

  return (
    <div style={{
      textAlign: 'center', padding: '8px 16px', marginTop: 8,
      fontSize: 11, color: '#4ade80',
    }}>
      <span style={{ opacity: 0.7 }}>
        クライアントサイド処理により約{savedCO2}g CO2を削減 (クラウド処理比)
      </span>
    </div>
  );
}
