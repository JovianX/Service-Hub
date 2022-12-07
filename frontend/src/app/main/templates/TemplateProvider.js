import yaml from 'js-yaml';
import YAML from 'json-to-pretty-yaml';
import { createContext, useCallback, useMemo, useState } from 'react';

export const TemplateContext = createContext({});

export const TemplateProvider = ({ children }) => {
  const [templateBuilder, setTemplateBuilder] = useState(null);
  const [infoIsYamlValid, setInfoIsYamlValid] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [isInputByHand, setIsInputByHand] = useState(false);

  const onChangeInputDescription = useCallback((newValue) => {
    setInputDescription(newValue);
  }, []);

  const configYamlText = useMemo(() => {
    if (!templateBuilder) return '';
    return YAML.stringify(templateBuilder);
  }, [templateBuilder]);

  const onChangeYaml = useCallback(
    (newValue) => {
      if (!isInputByHand) {
        try {
          setTemplateBuilder(yaml.load(newValue, { json: true }));
          setInfoIsYamlValid('');
        } catch (e) {
          setInfoIsYamlValid(e.reason);
        }
      }
    },
    [isInputByHand],
  );

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
      isInputByHand,
      setIsInputByHand,
    }),
    [templateBuilder, configYamlText, inputDescription, infoIsYamlValid, isInputByHand],
  );

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};
