import styles from './FieldError.module.css';
import m from 'mithril';

function FieldError(fieldErrors?: string[]): m.Component {
  return {
    view: function () {
      if (!fieldErrors || fieldErrors.length === 0) {
        return null;
      }
      return fieldErrors.map(err => {
        return m(`div.${styles.inputError}`, err);
      });
    },
  };
}

export { FieldError };
