import { StateUpdater } from 'preact/hooks';
import { getModels } from '../../openai';
import Button from '../button/button';
import Icon from '../icon/icon';
import TextInput from '../textInput/textInput';
import Typeography from '../typeography/typography';
import './settingsForm.scss';
import {useState, ChangeEvent, FormEvent, Dispatch } from 'preact/compat';

interface Props {
    closeFunction: () => void;
    apiKey: string;
    setApiKey: Dispatch<StateUpdater<string>>;
}

export default function SettingsForm({closeFunction, apiKey, setApiKey}:Props) {
    const [modelList, setModelList] = useState<{id: string}[]>([]);
    const [isValidKey, setIsValidKey] = useState(true);
    const [isLoadingTest, setIsLoadingTest] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        setApiKey(target.value);
    }

    async function handleTest(){
        setIsLoadingTest(true);
        if (apiKey == "") {
            setIsValidKey(false);
        }
        try {
            const modelList = await getModels(apiKey);
            setModelList(modelList);
            if (modelList.length < 1) {
                setIsValidKey(false);
                setIsLoadingTest(false);
            } else {
                setIsValidKey(true);
                setIsLoadingTest(false);
            }
        } catch (error) {
            setIsValidKey(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        parent.postMessage(
            {
              pluginMessage: {
                type: 'save-api-key',
                apiKey: apiKey,
              },
            },
            '*'
          );
        setIsSaving(false);
        closeFunction();
    }

    function handleCancel() {
        closeFunction();
    }

    return (
      <div className="settings-form-container">
        <form id='settingsForm' noValidate onSubmit={(e) => handleSubmit(e)} autoComplete='off'>
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
                addClasses={modelList.length > 0 ? "api-key-input success" : "api-key-input"}
            />
            {modelList.length < 1 ? (
                <div className="api-key-test-button-container">
                    <Button
                    text="Test"
                    variant="outline"
                    onClick={handleTest}
                    disabled={apiKey == ""}
                    addClasses="api-key-test-button"
                    isLoading={isLoadingTest}
                    />
                </div>
                ) : (
                    <div className="api-key-test-successIcon-container">
                        <Icon iconName="circleCheck" />
                    </div>
                )}
            </div>

            <div className='button-group'>
                <Button text='Save Settings' variant='filled' type='submit' isLoading={isSaving} />
                <Button text='Cancel' variant='outline' type='button' onClick={() => handleCancel()} />
            </div>
        </form>
      </div>
    );
}