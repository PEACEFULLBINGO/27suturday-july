import { Modal } from '@/components/layout/Modal/Modal';
import { Button } from '@/components/button/Button';
import { Confetti } from './Confetti';

interface AchievementModalProps {
  open: boolean;
  onClose: () => void;
}

export function AchievementModal({ open, onClose }: AchievementModalProps) {
  return (
    <>
      <Modal open={open} onClose={onClose} labelledBy="achievement-title">
        <div style={{ textAlign: 'center' }}>
          <div className="ach-ic">🏆</div>
          <h3 id="achievement-title">Perfect Day Achieved!</h3>
          <p>
            You completed all 4 criteria — study blocks, focus session, night review, and spark.
            That's a real habit. Keep the streak going!
          </p>
          <Button variant="primary" fullWidth onClick={onClose}>Keep the streak! 🔥</Button>
        </div>
      </Modal>
      {open && <Confetti onDone={() => {}} />}
    </>
  );
}
