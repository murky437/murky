import styles from './GeneralErrors.module.css';
import m from 'mithril';

function GeneralErrors(errors: string[]) {
  return {
    view: function () {
      if (errors.length > 0) {
        return m(
          `div.${styles.generalErrors}`,
          errors.map(err => {
            return m(`div.${styles.errorText}`, err);
          })
        );
      }
    },
  };
}

export { GeneralErrors };
