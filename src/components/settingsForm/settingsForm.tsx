import { StateUpdater, useEffect } from 'preact/hooks';
import { getModels } from '../../openai';
import Button from '../button/button';
import Icon from '../icon/icon';
import TextInput from '../textInput/textInput';
import Typeography from '../typeography/typography';
import './settingsForm.scss';
import {useState, FormEvent, Dispatch } from 'preact/compat';
import { v4 as uuidv4 } from "uuid";
import DropDown from '../dropDown/dropDown';

interface Props {
    closeFunction: () => void;
    apiKey: string;
    setApiKey: Dispatch<StateUpdater<string>>;
    dsLink: string;
    setDSLink: Dispatch<StateUpdater<string>>;
    apiModel: string;
    setApiModel: Dispatch<StateUpdater<string>>;
    primaryColor: string;
    setPrimaryColor: (newcolor:string) => void;
}

export default function SettingsForm({
    closeFunction, 
    apiKey, 
    setApiKey, 
    apiModel, 
    setApiModel,
    dsLink,
    setDSLink,
    primaryColor,
    setPrimaryColor
}:Props) {
    const [modelList, setModelList] = useState<{id: string}[]>([]);
    const [modelOptions, setModelOptions] = useState<{id: string, text:string, value:string}[]>([]);
    const [isValidKey, setIsValidKey] = useState(true);
    const [isLoadingTest, setIsLoadingTest] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [disableModelInput, setDisableModelInput] = useState(false);

    //these create local stateful versions of the apikey and the apimodel so that the form can be canceled without updating the saved key and model
    const [localApiKey, setLocalApiKey] = useState(apiKey);
    const [localModel, setLocalModal] = useState(apiModel);
    const [localDsLink, setLocalDsLink] = useState(dsLink);
    const [localPrimaryColor, setLocalPrimaryColor] = useState(primaryColor);

    useEffect(() => {
        if (apiKey !== undefined || "") {
            handleTest();
        }
    },[])
    
    useEffect(() => {
        const newModelOptions: {id: string, text:string, value:string}[] = 
            modelList
            .filter(model => !/realtime|audio|preview|dall-e|text-embedding|babbage|davinci|tts|whisper|transcribe|image|moderation|chat|codex/i.test(model.id))
            .sort((a, b) => a.id.localeCompare(b.id, undefined, { sensitivity: 'base' }))
            .map(model => ({
                id: uuidv4(),
                text: model.id,
                value: model.id
            }));
        setModelOptions(newModelOptions);
    }, modelList)

    function handleModelDropDownChange(newModel:string) {
        setLocalModal(newModel);
    }

    async function testKey(): Promise<boolean> {
        //return false if the key is empty or cannot pull the list of models from OpenAI
        if (localApiKey == "") {
            return false;
        } else {
            try {
                const modelList = await getModels(localApiKey);
                setModelList(modelList);
                if (modelList.length < 1) {
                    return false;
                } else {
                    return true;
                }
            } catch (error) {
                return false;
            }
        }
    }

    async function handleTest(){
        setIsLoadingTest(true);
        const keyIsValid = await testKey();
        setIsValidKey(keyIsValid);
        setDisableModelInput(!keyIsValid);
        setIsLoadingTest(false);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        setIsLoadingTest(true);
        const keyIsValid = await testKey();
        if (keyIsValid) {
            setApiKey(localApiKey);
            setApiModel(localModel);
            setPrimaryColor(localPrimaryColor);
            setDSLink(localDsLink);
            parent.postMessage(
                {
                pluginMessage: {
                    type: 'save-settings',
                    apiKey: localApiKey,
                    apiModel: localModel,
                    primaryColor: localPrimaryColor,
                    dsLink: localDsLink,
                },
                },
                '*'
            );
            setIsSaving(false);
            closeFunction();
        } else {
            setIsValidKey(keyIsValid);
            setDisableModelInput(!keyIsValid);
            setIsSaving(false);
            setIsLoadingTest(false);
        }
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
                value={localApiKey}
                onChange={(value) => setLocalApiKey(value)}
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
            {/* Need to improve this to handle changing the key and then retesting. */}
            {modelList.length < 1 ? (
                <div className="api-key-test-button-container">
                    <Button
                    text="Test"
                    variant="outline"
                    onClick={() => handleTest()}
                    disabled={localApiKey == ""}
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
            <DropDown
                id='api-model'
                value={localModel}
                label='Model'
                description='Choose which OpenAI Model you want MechaNick to use.'
                options={modelOptions}
                addClasses='model-selection'
                placeholder='Model name'
                isRequired
                onChange={handleModelDropDownChange}
                disabled={disableModelInput}
                errorMessage='Please select a model for MechaNick to use.'
            />

            <TextInput
                id="ds=link-input"
                value={localDsLink}
                onChange={(value) => setLocalDsLink(value)}
                placeholder="https://..."
                label="Design System Docs"
                description={"Provide the publicly available link to your team’s design system docs for MechaNick to research when answering design system questions."}
                addClasses='ds-link-input'
            />

            <TextInput
                id="primary-color-input"
                value={localPrimaryColor}
                onChange={(value) => setLocalPrimaryColor(value)}
                placeholder="#------"
                label="Primary Color"
                description={"Customize MechaNick with your own primary color."}
                addClasses='primary-color-input'
            />
            
            <div className='button-group'>
                <Button text='Save Settings' variant='filled' type='submit' isLoading={isSaving} />
                <Button text='Cancel' variant='outline' type='button' onClick={() => handleCancel()} />
            </div>
        </form>
      </div>
    );
}