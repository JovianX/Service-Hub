import yaml from 'js-yaml';
import { createContext, useCallback, useMemo, useState } from 'react';

import { formattingTemplateValues } from '../../uitls/formattingTemplateValues';

export const TemplateContext = createContext({});

export const TemplateProvider = ({ children }) => {
  const [infoIsYamlValid, setInfoIsYamlValid] = useState('');
  const [inputDescription, setInputDescription] = useState('');

  const [configYamlText, setConfigYamlText] = useState('');

  const onChangeInputDescription = useCallback((newValue) => {
    setInputDescription(newValue);
  }, []);

  const templateBuilder = useMemo(() => {
    if (!configYamlText) return {};
    let changedConfigYamlText = '';
    try {
      if (infoIsYamlValid) {
        setInfoIsYamlValid('');
      }
      changedConfigYamlText = yaml.load(configYamlText, { json: true });
      changedConfigYamlText = yaml.dump(changedConfigYamlText, { skipInvalid: true });
      changedConfigYamlText = yaml.load(changedConfigYamlText, { json: true });
      return changedConfigYamlText;
    } catch (e) {
      setInfoIsYamlValid(e.reason);
    }
  }, [configYamlText]);

  const setTemplateBuilder = setConfigYamlText;

  const onChangeYaml = useCallback((newValue) => {
    const replacedNewValue = formattingTemplateValues(newValue);
    setConfigYamlText(replacedNewValue);
  }, []);

  const value = useMemo(
    () => ({
      templateBuilder,
      setTemplateBuilder,
      configYamlText,
      onChangeYaml,
      infoIsYamlValid,
      setInfoIsYamlValid,
      inputDescription,
      onChangeInputDescription,
    }),
    [templateBuilder, configYamlText, inputDescription, infoIsYamlValid],
  );

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};
