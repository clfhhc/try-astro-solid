import styles from './questionLink.module.css';

export interface Props {
  text: string;
  href: string;
}

function QuestionLink({ text, href }: Props) {
  return (
    <div class={styles['link-card']}>
      <a href={href}>
        <p>
          <p>{text}</p>
          <span>&rarr;</span>
        </p>
      </a>
    </div>
  );
}

export default QuestionLink;
