import styles from './difficultyLabel.module.css';

export interface Props {
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function DifficultyLabel({ difficulty }: Props) {
  return (
    <div class={styles['difficulty-label']}>
      <span
        classList={{
          [styles.easy]: difficulty === 'Easy',
          [styles.medium]: difficulty === 'Medium',
          [styles.hard]: difficulty === 'Hard',
        }}
      >
        {difficulty}
      </span>
    </div>
  );
}

export default DifficultyLabel;
