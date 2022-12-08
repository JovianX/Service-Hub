import yaml from 'js-yaml';
import YAML from 'json-to-pretty-yaml';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { formattingTemplateValues } from '../../uitls/formattingTemplateValues';

export const TemplateContext = createContext({});

export const TemplateProvider = ({ children }) => {
  const [templateBuilder, setTemplateBuilder] = useState(null);
  const [infoIsYamlValid, setInfoIsYamlValid] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [isInputByHand, setIsInputByHand] = useState(true);
  const [changedByHandConfigYamlText, setChangedByHandConfigYamlText] = useState('');

  const onChangeInputDescription = useCallback((newValue) => {
    setInputDescription(newValue);
  }, []);

  const configYamlText = useMemo(() => {
    if (!templateBuilder) return '';
    const replacedNewValue = formattingTemplateValues(YAML.stringify(templateBuilder));
    setChangedByHandConfigYamlText(replacedNewValue);
    return YAML.stringify(templateBuilder);
  }, [templateBuilder]);

  const onChangeYaml = useCallback(
    (newValue) => {
      const replacedNewValue = formattingTemplateValues(newValue);
      if (isInputByHand) {
        try {
          setChangedByHandConfigYamlText(replacedNewValue);
          setTemplateBuilder(yaml.load(replacedNewValue, { json: true }));
          setInfoIsYamlValid('');
        } catch (e) {
          setInfoIsYamlValid(e.reason);
        }
      } else {
        setChangedByHandConfigYamlText(replacedNewValue);
      }
    },
    [isInputByHand],
  );

  useEffect(() => {
    if (isInputByHand) {
      setInfoIsYamlValid('');
      onChangeYaml(changedByHandConfigYamlText);
    }
  }, [isInputByHand]);

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
