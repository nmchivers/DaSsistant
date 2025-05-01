import { getModels } from '../../openai';
import Button from '../button/button';
import Icon from '../icon/icon';
import TextInput from '../textInput/textInput';
import Typeography from '../typeography/typography';
import './settingsForm.scss';
import {useState, ChangeEvent } from 'preact/compat';

interface Props {

}

export default function SettingsForm({}:Props) {
    const [apiKey, setApiKey] = useState("");
    const [modelList, setModelList] = useState<{id: string}[]>([]);
    const [isValidKey, setIsValidKey] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        setApiKey(target.value);
    }
    async function handleTest(){
        setIsLoading(true);
        if (apiKey == "") {
            setIsValidKey(false);
        }
        try {
            const modelList = await getModels(apiKey);
            setModelList(modelList);
            if (modelList.length < 1) {
                setIsValidKey(false);
                setIsLoading(false);
            } else {
                setIsValidKey(true);
                setIsLoading(false);
            }
        } catch (error) {
            setIsValidKey(false);
        }
    }

    return (
      <div className="settings-form-container">
        <div className="api-key-input-miniform">
          <TextInput
            id="api-key"
            value={apiKey}
            onChange={handleInputChange}
            placeholder="sk-###..."
            label="OpenAI API Key"
            description={
              <>
                You will need your own{" "}
                <Typeography
                  copy="API key from OpenAI"
                  tagType="a"
                  href="https://openai.com/api/"
                  style="body.small"
                  color="unset"
                  target="_blank"
                />{" "}
                to run MechaNick.
              </>
            }
            isRequired
            isInvalid={!isValidKey}
            errorMessage="Please provide a valid Open AI API Key."
            addClasses="api-key-input"
          />
          {modelList.length < 1 ? (
              <div className="api-key-test-button-container">
                <Button
                  text="Test"
                  variant="outline"
                  onClick={handleTest}
                  disabled={apiKey == ""}
                  addClasses="api-key-test-button"
                  isLoading={isLoading}
                />
              </div>
            ) : (
                <div className="api-key-test-successIcon-container">
                    <Icon iconName="circleCheck" />
                </div>
            )}
        </div>
      </div>
    );
}