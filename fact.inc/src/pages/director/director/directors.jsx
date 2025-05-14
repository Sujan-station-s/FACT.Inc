import React, { useState, useEffect, useCallback } from "react";
import CardLayout from "../../components/PageCard/PageCard";
import "./directors.css";
import { useNavigate } from "react-router-dom";

// ... (other imports remain the same)
import QrCodePopup from "./components/QrCodePopup";
import DirectorNameForm from "./components/DirectorNameForm";
import DirectorPersonalForm from "./components/DirectorPersonalForm";
import DirectorDinDscForm from "./components/DirectorDinDscForm";
import DirectorAddressForm from "./components/DirectorAddressForm";
import DirectorDocsForm from "./components/DirectorDocsForm";

import {
  fetchDirectorInfoAPI,
  saveDirectorNameDetailsAPI,
  saveDirectorAddressDetailsAPI,
  saveDirectorPersonalAndDinDscDetailsAPI,
  uploadDirectorDocumentAPI,
} from "./services/directorAPIs";

import {
  ORG_ID,
  initialDirectorData,
  directorSubPageNavItems,
  MIN_DIRECTORS,
  MAX_DIRECTORS,
} from "./constants";

// ... (getApiDocumentTypeForUpload and directorFormSteps remain the same)
const getApiDocumentTypeForUpload = (docTitle, directorType) => {
  const title = docTitle.toLowerCase();
  if (title.includes("pan card")) return "PAN_attested_full";
  if (title.includes("aadhaar")) return "aadhaar_attested_full";
  if (title.includes("photo")) return "photo";
  if (title.includes("bank statement")) return "Bank_statement";
  if (title.includes("passbook")) return "Bank_passbook";
  if (title.includes("mobile bill") || title.includes("telephone bill"))
    return "Teliphone_bill";
  if (title.includes("electricity bill")) return "Electricity_bill";
  if (title.includes("voter id")) return "voter_attested_full";
  if (title.includes("driving licence")) return "drivingLicence_attested_full";
  if (title.includes("gas bill")) return "Gas_bill";
  if (title.includes("water bill")) return "Water_bill";
  if (title.includes("property tax")) return "Property_tax_reciept";
  if (title.includes("passport")) return "passport";
  if (title.includes("address proof") && directorType === "nri")
    return "ADDRESS_PROOF_attested_full";
  if (title.includes("visa") && directorType === "nri")
    return "VISA_attested_full";
  console.warn(
    `[getApiDocumentTypeForUpload] No specific mapping for: "${docTitle}". Using fallback.`
  );
  return docTitle.toUpperCase().replace(/\s+/g, "_");
};

const directorFormSteps = [
  {
    key: "name",
    title: "Name Details",
    FormComponent: DirectorNameForm,
    saveActionKey: "saveName",
    subPageId: "name",
  },
  {
    key: "personal",
    title: "Personal Details",
    FormComponent: DirectorPersonalForm,
    saveActionKey: "savePersonalDinDsc",
    subPageId: "personal",
  },
  {
    key: "din",
    title: "DIN/DSC Information",
    FormComponent: DirectorDinDscForm,
    saveActionKey: "savePersonalDinDsc",
    subPageId: "din",
  },
  {
    key: "address",
    title: "Address Details",
    FormComponent: DirectorAddressForm,
    saveActionKey: "saveAddress",
    subPageId: "address",
  },
  {
    key: "docs",
    title: "Document Upload",
    FormComponent: DirectorDocsForm,
    saveActionKey: null, // No direct save action, uploads are separate
    subPageId: "docs",
  },
];

const DIRECTOR_COUNT_CARD_INDEX = 1;
const FIRST_DIRECTOR_DETAIL_CARD_INDEX = DIRECTOR_COUNT_CARD_INDEX + 1;
// Calculate TOTAL_CARDS based on the number of director form steps
const TOTAL_CARDS =
  FIRST_DIRECTOR_DETAIL_CARD_INDEX + directorFormSteps.length - 1; // -1 because steps are 0-indexed for card mapping

export default function DirectorsPage() {
  const [currentCard, setCurrentCard] = useState(DIRECTOR_COUNT_CARD_INDEX);
  const [directorCount, setDirectorCount] = useState(MIN_DIRECTORS);
  const [activeDirector, setActiveDirector] = useState(0);
  const [directorsData, setDirectorsData] = useState(() =>
    Array.from({ length: MIN_DIRECTORS }, () => ({ ...initialDirectorData }))
  );
  const [originalDirectorDataSnapshot, setOriginalDirectorDataSnapshot] =
    useState(null);

  const [selectedFiles, setSelectedFiles] = useState({});
  const navigate = useNavigate();
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [qrPopupData, setQrPopupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const showAppNotification = useCallback(
    (message, type = "info", duration = 4000) => {
      setNotification({ visible: true, message, type });
      const timer = setTimeout(
        () => setNotification((prev) => ({ ...prev, visible: false })),
        duration
      );
      return () => clearTimeout(timer);
    },
    [setNotification]
  );

  // useEffect to set the snapshot when navigating to a new director or form step.
  // This runs *after* activeDirector or currentCard changes.
  // directorsData[activeDirector] inside here will be the correct data for the new view.
  useEffect(() => {
    if (
      currentCard >= FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
      currentCard <= TOTAL_CARDS
    ) {
      const directorDataForNewView = directorsData[activeDirector];
      if (directorDataForNewView) {
        // console.log('Snapshotting on NAV: Director', activeDirector, 'Card', currentCard, 'Data:', JSON.parse(JSON.stringify(directorDataForNewView)));
        setOriginalDirectorDataSnapshot(
          JSON.parse(JSON.stringify(directorDataForNewView))
        );
      } else {
        // console.log('Snapshotting on NAV: No data for Director', activeDirector, 'Card', currentCard);
        setOriginalDirectorDataSnapshot(null);
      }
    } else {
      // console.log('Snapshotting on NAV: Not on detail card. Card:', currentCard);
      setOriginalDirectorDataSnapshot(null); // Clear snapshot if not on a detail card
    }
  }, [activeDirector, currentCard]); // INTENTIONALLY DO NOT INCLUDE directorsData here

  const hasDataChangedForCurrentStep = useCallback(() => {
    if (!originalDirectorDataSnapshot || !directorsData[activeDirector]) {
      // console.log('hasDataChanged: No snapshot or current director data.');
      return false; // Or true if we want to force save if no snapshot (e.g. new item)
    }
    const currentDirector = directorsData[activeDirector];
    const stepIndex = currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX;

    if (stepIndex < 0 || stepIndex >= directorFormSteps.length) {
      // console.log('hasDataChanged: Invalid stepIndex', stepIndex);
      return false;
    }
    const stepKey = directorFormSteps[stepIndex].key;
    let changed = false;

    // console.log('hasDataChanged comparing for step:', stepKey);
    // console.log('Current director data:', currentDirector);
    // console.log('Original snapshot data:', originalDirectorDataSnapshot);

    if (stepKey === "name") {
      changed =
        originalDirectorDataSnapshot.fullName !== currentDirector.fullName ||
        originalDirectorDataSnapshot.preferredFirstName !==
          currentDirector.preferredFirstName ||
        originalDirectorDataSnapshot.preferredMiddleName !==
          currentDirector.preferredMiddleName ||
        originalDirectorDataSnapshot.preferredLastName !==
          currentDirector.preferredLastName ||
        originalDirectorDataSnapshot.fatherFirstName !==
          currentDirector.fatherFirstName ||
        originalDirectorDataSnapshot.fatherMiddleName !==
          currentDirector.fatherMiddleName ||
        originalDirectorDataSnapshot.fatherLastName !==
          currentDirector.fatherLastName;
    } else if (stepKey === "personal" || stepKey === "din") {
      // Combined for Personal & DIN/DSC
      changed =
        originalDirectorDataSnapshot.dob !== currentDirector.dob ||
        originalDirectorDataSnapshot.gender !== currentDirector.gender ||
        originalDirectorDataSnapshot.nationality !==
          currentDirector.nationality ||
        originalDirectorDataSnapshot.email !== currentDirector.email ||
        originalDirectorDataSnapshot.phone !== currentDirector.phone ||
        originalDirectorDataSnapshot.education !== currentDirector.education ||
        originalDirectorDataSnapshot.occupationType !==
          currentDirector.occupationType ||
        originalDirectorDataSnapshot.occupationArea !==
          currentDirector.occupationArea ||
        originalDirectorDataSnapshot.experience !==
          currentDirector.experience ||
        originalDirectorDataSnapshot.hasDIN !== currentDirector.hasDIN ||
        originalDirectorDataSnapshot.dinNumber !== currentDirector.dinNumber ||
        originalDirectorDataSnapshot.hasDSC !== currentDirector.hasDSC ||
        originalDirectorDataSnapshot.isDSCRegistered !==
          currentDirector.isDSCRegistered;
    } else if (stepKey === "address") {
      changed =
        originalDirectorDataSnapshot.currentAddress1 !==
          currentDirector.currentAddress1 ||
        originalDirectorDataSnapshot.currentAddress2 !==
          currentDirector.currentAddress2 ||
        originalDirectorDataSnapshot.currentCity !==
          currentDirector.currentCity ||
        originalDirectorDataSnapshot.currentState !==
          currentDirector.currentState ||
        originalDirectorDataSnapshot.currentPin !==
          currentDirector.currentPin ||
        originalDirectorDataSnapshot.currentCountry !==
          currentDirector.currentCountry ||
        originalDirectorDataSnapshot.showPermanentAddress !==
          currentDirector.showPermanentAddress ||
        originalDirectorDataSnapshot.permanentAddress1 !==
          currentDirector.permanentAddress1 ||
        originalDirectorDataSnapshot.permanentAddress2 !==
          currentDirector.permanentAddress2 ||
        originalDirectorDataSnapshot.permanentCity !==
          currentDirector.permanentCity ||
        originalDirectorDataSnapshot.permanentState !==
          currentDirector.permanentState ||
        originalDirectorDataSnapshot.permanentPin !==
          currentDirector.permanentPin ||
        originalDirectorDataSnapshot.permanentCountry !==
          currentDirector.permanentCountry;
    } else if (stepKey === "docs") {
      // For docs, "change" means different selected files or different committed document paths
      // This is harder to track with selectedFiles state vs directorsData.documents
      // For simplicity, hasDataChanged for 'docs' might not be as critical if uploads are immediate.
      // Or, if we want to be precise, compare directorsData[activeDirector].documents with originalDirectorDataSnapshot.documents
      // For now, let's assume doc uploads are discrete actions and don't rely on this for "Save & Proceed" of the docs tab itself.
      changed = false; // Or implement specific logic for doc changes if needed here
    }
    // console.log(`hasDataChanged for ${stepKey}: ${changed}`);
    return changed;
  }, [
    directorsData,
    activeDirector,
    currentCard,
    originalDirectorDataSnapshot,
  ]);

  const saveDirectorNameDetails = useCallback(
    async (directorIndex) => {
      const directorToSave = { ...directorsData[directorIndex] };
      if (!directorToSave) return null;

      if (
        !directorToSave.fullName ||
        !directorToSave.preferredFirstName ||
        !directorToSave.preferredLastName ||
        !directorToSave.fatherFirstName ||
        !directorToSave.fatherLastName
      ) {
        showAppNotification(
          "Full Name, Preferred First/Last Name, and Father's First/Last Name are required to save name details.",
          "warning"
        );
        return directorToSave.dir_id || null;
      }

      setIsSaving(true);
      try {
        if (directorToSave.dir_id) {
          // EXISTING DIRECTOR: Use saveDirectorPersonalAndDinDscDetailsAPI
          // This API updates name, personal, DIN/DSC details via /updateDirDetails endpoint
          const wasSuccessful = await saveDirectorPersonalAndDinDscDetailsAPI(
            directorToSave,
            ORG_ID
          );
          if (wasSuccessful) {
            // saveDirectorPersonalAndDinDscDetailsAPI handles its own notification and snapshot update.
            // We can override with a more specific message for clarity if only names were intended to be saved.
            showAppNotification(
              `Director ${
                directorToSave.preferredFirstName || directorIndex + 1
              } details updated successfully.`, // More generic success message
              "success"
            );
            return directorToSave.dir_id; // Return existing dir_id
          } else {
            // Failure notification handled by saveDirectorPersonalAndDinDscDetailsAPI
            return null; // Indicate failure
          }
        } else {
          // NEW DIRECTOR: Use saveDirectorNameDetailsAPI (hits /dirBaseDetails)
          const creationResult = await saveDirectorNameDetailsAPI(
            directorToSave,
            ORG_ID
          );
          if (creationResult.status === "success" && creationResult.dir_id) {
            const newDirId = creationResult.dir_id;
            showAppNotification(
              `Director ${
                directorToSave.preferredFirstName || directorIndex + 1
              } name details saved. ID: ${newDirId}`,
              "success"
            );
            const updatedDirectorWithNewId = {
              ...directorToSave,
              dir_id: newDirId,
            };
            setDirectorsData((prevData) => {
              const newData = [...prevData];
              newData[directorIndex] = updatedDirectorWithNewId;
              return newData;
            });
            if (directorIndex === activeDirector) {
              setOriginalDirectorDataSnapshot(
                JSON.parse(JSON.stringify(updatedDirectorWithNewId))
              );
            }
            return newDirId; // Return new dir_id
          } else {
            showAppNotification(
              `Failed to save name for ${
                directorToSave.preferredFirstName || directorIndex + 1
              }: ${creationResult.message || "API error"}`,
              "error"
            );
            return null; // Indicate failure
          }
        }
      } catch (error) {
        showAppNotification(
          `Error processing name details for ${
            directorToSave.preferredFirstName || directorIndex + 1
          }: ${error.message}`,
          "error"
        );
        return null; // Indicate failure
      } finally {
        setIsSaving(false);
      }
    },
    [directorsData, showAppNotification, ORG_ID, activeDirector]
  );

  const saveDirectorAddressDetails = useCallback(
    async (directorIndex) => {
      const directorToSave = { ...directorsData[directorIndex] };
      if (!directorToSave || !directorToSave.dir_id) {
        showAppNotification(
          `Cannot save address: Director ${
            directorIndex + 1
          } ID missing. Save 'Name' first.`,
          "warning"
        );
        return false;
      }
      setIsSaving(true);
      try {
        const result = await saveDirectorAddressDetailsAPI(
          directorToSave,
          ORG_ID
        );
        if (result.status === "success") {
          showAppNotification(
            `Address saved for Director ${
              directorToSave.preferredFirstName || directorIndex + 1
            }.`,
            "success"
          );
          if (directorIndex === activeDirector) {
            // Update snapshot with the data that was just saved
            setOriginalDirectorDataSnapshot(
              JSON.parse(JSON.stringify(directorToSave))
            );
          }
          return true;
        } else {
          showAppNotification(
            `Failed to save address for ${
              directorToSave.preferredFirstName || directorIndex + 1
            }: ${result.message || "API error"}`,
            "error"
          );
        }
      } catch (error) {
        showAppNotification(
          `Error saving address for ${
            directorToSave.preferredFirstName || directorIndex + 1
          }: ${error.message}`,
          "error"
        );
      } finally {
        setIsSaving(false);
      }
      return false;
    },
    [directorsData, showAppNotification, ORG_ID, activeDirector]
  );

  const saveDirectorPersonalAndDinDscDetails = useCallback(
    async (directorIndex) => {
      const directorToSave = { ...directorsData[directorIndex] };
      if (!directorToSave || !directorToSave.dir_id) {
        showAppNotification(
          `Cannot save Personal/DIN/DSC: Director ${
            directorIndex + 1
          } ID missing. Save 'Name' first.`,
          "warning"
        );
        return false;
      }
      setIsSaving(true);
      try {
        const result = await saveDirectorPersonalAndDinDscDetailsAPI(
          directorToSave,
          ORG_ID
        );
        if (result.status === "success") {
          showAppNotification(
            `Personal & DIN/DSC details saved for Director ${
              directorToSave.preferredFirstName || directorIndex + 1
            }.`,
            "success"
          );
          if (directorIndex === activeDirector) {
            // Update snapshot with the data that was just saved
            setOriginalDirectorDataSnapshot(
              JSON.parse(JSON.stringify(directorToSave))
            );
          }
          return true;
        } else {
          showAppNotification(
            `Failed to save Personal/DIN/DSC for ${
              directorToSave.preferredFirstName || directorIndex + 1
            }: ${result.message || "API error"}`,
            "error"
          );
        }
      } catch (error) {
        showAppNotification(
          `Error saving Personal/DIN/DSC for ${
            directorToSave.preferredFirstName || directorIndex + 1
          }: ${error.message}`,
          "error"
        );
      } finally {
        setIsSaving(false);
      }
      return false;
    },
    [directorsData, showAppNotification, ORG_ID, activeDirector]
  );

  const directorSaveActions = {
    saveName: saveDirectorNameDetails,
    savePersonalDinDsc: saveDirectorPersonalAndDinDscDetails,
    saveAddress: saveDirectorAddressDetails,
  };

  const fetchDirectorInfo = useCallback(async () => {
    if (!ORG_ID) {
      setIsLoading(false);
      const initialDirs = Array.from({ length: MIN_DIRECTORS }, () => ({
        ...initialDirectorData,
      }));
      setDirectorsData(initialDirs);
      setDirectorCount(MIN_DIRECTORS);
      setActiveDirector(0);
      setCurrentCard(DIRECTOR_COUNT_CARD_INDEX);
      // Snapshot initial data for the first director if on count card initially
      if (
        DIRECTOR_COUNT_CARD_INDEX < FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
        initialDirs[0]
      ) {
        // This case might not be strictly needed if useEffect handles it, but for clarity:
        // setOriginalDirectorDataSnapshot(JSON.parse(JSON.stringify(initialDirs[0])));
      } else if (DIRECTOR_COUNT_CARD_INDEX === currentCard) {
        setOriginalDirectorDataSnapshot(null); // No specific director data on count card
      }
      return;
    }
    setIsLoading(true);
    try {
      const result = await fetchDirectorInfoAPI(ORG_ID);
      if (
        result.status === "success" &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        const fetchedDirectors = result.data.map((dir) => ({
          ...initialDirectorData,
          dir_id: dir.dir_id || null,
          fullName: dir.name || "",
          preferredFirstName: dir.firstname || "",
          preferredMiddleName: dir.middlename || "",
          preferredLastName: dir.lastname || "",
          fatherFirstName: dir.ffname || "",
          fatherMiddleName: dir.fmname || "",
          fatherLastName: dir.flname || "",
          dob: dir.dob || "",
          gender: dir.gender || "",
          nationality:
            dir.nationality || (dir.director_type === "indian" ? "Indian" : ""),
          email: dir.email || "",
          phone: dir.phone || dir.mobile || "",
          education: dir.education || dir.edu || "",
          occupationType: dir.occupation_type || dir.occupation || "",
          occupationArea: dir.occupation_area || "",
          experience: dir.experience || "",
          hasDIN:
            dir.has_din === "yes" || dir.has_din === true || !!dir.DIN
              ? "yes"
              : "no",
          dinNumber: dir.din_number || dir.DIN || "",
          hasDSC:
            dir.has_dsc === "yes" ||
            dir.has_dsc === true ||
            dir.dsc_available === true
              ? "yes"
              : "no",
          isDSCRegistered:
            dir.is_dsc_registered === "yes" || dir.is_dsc_registered === true
              ? "yes"
              : "no",
          currentAddress1: dir.address?.pe_line1 || "",
          currentAddress2: dir.address?.pe_line2 || "",
          currentCity: dir.address?.pe_city || "",
          currentState: dir.address?.pe_state_or_ut || "",
          currentPin: dir.address?.pe_pin_code || "",
          currentCountry: dir.address?.pe_country || "India",
          showPermanentAddress: dir.show_permanent_address === true,
          permanentAddress1: dir.address?.pr_line1 || "",
          permanentAddress2: dir.address?.pr_line2 || "",
          permanentCity: dir.address?.pr_city || "",
          permanentState: dir.address?.pr_state_or_ut || "",
          permanentPin: dir.address?.pr_pin_code || "",
          permanentCountry: dir.address?.pr_country || "India",
          directorType: dir.director_type || "indian",
          documents: dir.documents || {},
        }));
        setDirectorsData(fetchedDirectors);
        setDirectorCount(fetchedDirectors.length);
        const initialActiveDirector = 0;
        setActiveDirector(initialActiveDirector);
        const initialCurrentCard = FIRST_DIRECTOR_DETAIL_CARD_INDEX;
        setCurrentCard(initialCurrentCard);

        // Explicitly snapshot the data for the initially loaded director and card
        // This will be picked up by the useEffect([activeDirector, currentCard]) anyway,
        // but doing it here ensures snapshot is set if that effect has race conditions with state setting.
        // However, relying on the useEffect is cleaner. The states set here will trigger it.
        // if (fetchedDirectors[initialActiveDirector]) {
        //   setOriginalDirectorDataSnapshot(JSON.parse(JSON.stringify(fetchedDirectors[initialActiveDirector])));
        // }
      } else {
        // No existing data or API error
        const initialDirs = Array.from({ length: MIN_DIRECTORS }, () => ({
          ...initialDirectorData,
        }));
        setDirectorsData(initialDirs);
        setDirectorCount(MIN_DIRECTORS);
        setActiveDirector(0);
        setCurrentCard(DIRECTOR_COUNT_CARD_INDEX);
        if (result.status !== "success" && result.message) {
          showAppNotification(
            `Failed to fetch director info: ${result.message}`,
            "error"
          );
        }
        // setOriginalDirectorDataSnapshot(JSON.parse(JSON.stringify(initialDirs[0]))); for consistency if needed
      }
    } catch (error) {
      showAppNotification(
        `Error fetching director data: ${error.message}`,
        "error"
      );
      const initialDirs = Array.from({ length: MIN_DIRECTORS }, () => ({
        ...initialDirectorData,
      }));
      setDirectorsData(initialDirs);
      setDirectorCount(MIN_DIRECTORS);
      setActiveDirector(0);
      setCurrentCard(DIRECTOR_COUNT_CARD_INDEX);
      // setOriginalDirectorDataSnapshot(JSON.parse(JSON.stringify(initialDirs[0])));
    } finally {
      setIsLoading(false);
    }
  }, [showAppNotification, ORG_ID]); // Removed state setters from deps, they are implicitly part of component scope

  useEffect(() => {
    fetchDirectorInfo();
  }, [fetchDirectorInfo]);

  const handleDirectorInputChange = useCallback(
    (fieldName, value) => {
      setDirectorsData((prevData) => {
        const newData = [...prevData];
        if (!newData[activeDirector]) {
          newData[activeDirector] = { ...initialDirectorData };
        }
        const updatedDirector = {
          ...newData[activeDirector],
          [fieldName]: value,
        };
        if (fieldName === "directorType") {
          updatedDirector.nationality = value === "indian" ? "Indian" : "";
          updatedDirector.documents = {}; // Clear documents when type changes
          setSelectedFiles((prevFiles) => {
            const newFiles = { ...prevFiles };
            Object.keys(newFiles).forEach((key) => {
              if (key.startsWith(`${activeDirector}-`)) {
                // Clear selected files for this director
                delete newFiles[key];
              }
            });
            return newFiles;
          });
          showAppNotification(
            "Director type changed. Document requirements updated.",
            "info",
            2000
          );
        }
        if (fieldName === "permanentSameAsCurrent") {
          const isChecked = value;
          updatedDirector.showPermanentAddress = !isChecked;
          if (isChecked) {
            updatedDirector.permanentAddress1 = updatedDirector.currentAddress1;
            updatedDirector.permanentAddress2 = updatedDirector.currentAddress2;
            updatedDirector.permanentCity = updatedDirector.currentCity;
            updatedDirector.permanentState = updatedDirector.currentState;
            updatedDirector.permanentPin = updatedDirector.currentPin;
            updatedDirector.permanentCountry = updatedDirector.currentCountry;
          }
        }
        newData[activeDirector] = updatedDirector;
        return newData;
      });
    },
    [activeDirector, showAppNotification] // Removed directorsData as it's from prevData
  );

  const handleSaveAndProceed = useCallback(async () => {
    if (isSaving) return;

    const director = directorsData[activeDirector];
    let canProceed = true;
    let dirIdForNextStep = director?.dir_id;

    if (currentCard === DIRECTOR_COUNT_CARD_INDEX) {
      // This is the director count card, just proceed to the first detail card.
      // The count submit handler already moves to FIRST_DIRECTOR_DETAIL_CARD_INDEX
      // So, this path in handleSaveAndProceed might not be hit if count submit is primary.
      // If it is hit, we just move to the next card.
    } else if (
      currentCard >= FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
      currentCard <= TOTAL_CARDS
    ) {
      const stepIndex = currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX;
      if (stepIndex < 0 || stepIndex >= directorFormSteps.length) {
        console.error("Invalid step index in handleSaveAndProceed");
        return;
      }
      const stepConfig = directorFormSteps[stepIndex];
      const dataChanged = hasDataChangedForCurrentStep(); // This should now work correctly

      // console.log(`Save & Proceed: Card ${currentCard}, Step ${stepConfig.key}, Data Changed: ${dataChanged}, Dir ID: ${director?.dir_id}`);

      if (stepConfig.key === "name") {
        if (
          !director.fullName ||
          !director.preferredFirstName ||
          !director.preferredLastName ||
          !director.fatherFirstName ||
          !director.fatherLastName
        ) {
          showAppNotification(
            "Name, Preferred First/Last Name, and Father's First/Last Name are required to save.",
            "warning"
          );
          canProceed = false; // Don't proceed if required name fields are missing
        } else if (dataChanged || !director.dir_id) {
          // Save if data changed OR if dir_id is missing (new director)
          const savedDirId = await directorSaveActions.saveName(activeDirector);
          if (!savedDirId) {
            canProceed = false; // Save failed or didn't return ID
          } else {
            dirIdForNextStep = savedDirId; // Update dirId for subsequent checks/steps
          }
        }
      } else if (stepConfig.saveActionKey) {
        // For steps like Personal, DIN/DSC, Address
        if (!dirIdForNextStep) {
          // Check if dir_id exists (should have been saved from Name step)
          showAppNotification(
            `Complete and save 'Name' details for Director ${
              activeDirector + 1
            } first.`,
            "warning"
          );
          canProceed = false;
        } else if (dataChanged) {
          // Only save if data has actually changed
          const saveSuccess = await directorSaveActions[
            stepConfig.saveActionKey
          ](activeDirector);
          if (!saveSuccess) {
            canProceed = false;
          }
        }
      }
      // For 'docs' step, there's no direct save action via "Save & Proceed". Uploads are handled by handleFileChange/handleQrClick.
    }

    if (!canProceed) {
      // setIsSaving(false); // Already handled in save functions
      return;
    }

    // Navigation logic
    if (currentCard < TOTAL_CARDS) {
      // Before moving to the next card (detail step), ensure dir_id exists if past the 'name' step.
      const latestDirectorData = directorsData[activeDirector]; // Get the potentially updated director data
      const finalDirIdForCheck = latestDirectorData?.dir_id || dirIdForNextStep;

      // If we just completed the NAME step (FIRST_DIRECTOR_DETAIL_CARD_INDEX) and didn't get a dir_id
      if (
        currentCard === FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
        !finalDirIdForCheck
      ) {
        showAppNotification(
          "Name details must be saved successfully with a Director ID to proceed.",
          "error"
        );
        return;
      }
      // For any other step (personal, din, address) requiring dir_id
      if (
        currentCard > FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
        currentCard < TOTAL_CARDS && // Not applicable for docs tab in this check
        directorFormSteps[currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX]
          .saveActionKey && // Only if it's a savable step
        !finalDirIdForCheck
      ) {
        showAppNotification(
          `Director ID is missing for Director ${
            activeDirector + 1
          }. Cannot proceed to next details step.`,
          "error"
        );
        return;
      }
      setCurrentCard((prev) => prev + 1);
    } else {
      // Reached the end of director forms
      // Final save for the last step if applicable and data changed
      const stepIndex = currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX;
      if (stepIndex >= 0 && stepIndex < directorFormSteps.length) {
        const lastStepConfig = directorFormSteps[stepIndex];
        if (lastStepConfig.saveActionKey && hasDataChangedForCurrentStep()) {
          if (directorsData[activeDirector]?.dir_id) {
            await directorSaveActions[lastStepConfig.saveActionKey](
              activeDirector
            );
          } else if (
            lastStepConfig.key === "name" &&
            directorsData[activeDirector].fullName /* etc required fields*/
          ) {
            await directorSaveActions.saveName(activeDirector);
          }
        }
      }

      // Logic for multiple directors:
      // If there are more directors to fill and we just finished the last form step for the current director
      if (activeDirector < directorCount - 1 && currentCard === TOTAL_CARDS) {
        showAppNotification(
          `Details for Director ${
            activeDirector + 1
          } complete. Proceeding to Director ${activeDirector + 2}.`,
          "info"
        );
        setActiveDirector((prev) => prev + 1);
        setCurrentCard(FIRST_DIRECTOR_DETAIL_CARD_INDEX); // Go to the first form step for the new director
      } else {
        // All directors' forms are filled
        showAppNotification(
          "All director details completed. Proceeding to next section...",
          "info",
          2000
        );
        navigate("/spice-partb"); // Example: Navigate to the next main section
      }
    }
  }, [
    currentCard,
    directorsData,
    activeDirector,
    directorSaveActions,
    showAppNotification,
    navigate,
    isSaving, // to prevent double clicks
    hasDataChangedForCurrentStep, // Now this should be reliable
    directorCount, // For multi-director navigation logic
  ]);

  const handlePrev = () => {
    if (isSaving) return;
    if (currentCard > DIRECTOR_COUNT_CARD_INDEX) {
      // Ensure we don't go before the count card
      // If on the first form of a director (not the first director)
      if (
        currentCard === FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
        activeDirector > 0
      ) {
        setActiveDirector((prev) => prev - 1); // Go to previous director
        setCurrentCard(TOTAL_CARDS); // Go to last form of previous director
      } else {
        setCurrentCard((prev) => prev - 1);
      }
    }
  };

  const handleDirectorCountSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isSaving) return;
      const count = Math.max(
        MIN_DIRECTORS,
        Math.min(MAX_DIRECTORS, directorCount)
      );
      // Check if any director already has a dir_id (meaning it's saved)
      if (directorsData.some((d) => !!d.dir_id)) {
        showAppNotification(
          "Director count is locked as some director details are already saved. Use Add/Remove buttons to manage directors.",
          "warning"
        );
        setDirectorCount(directorsData.length); // Reset to actual length
        return;
      }

      setDirectorCount(count);
      setDirectorsData((prevData) => {
        const currentLength = prevData.length;
        if (count > currentLength) {
          return [
            ...prevData,
            ...Array.from({ length: count - currentLength }, () => ({
              ...initialDirectorData,
            })),
          ];
        } else if (count < currentLength) {
          return prevData.slice(0, count);
        }
        return prevData;
      });
      if (activeDirector >= count) {
        setActiveDirector(Math.max(0, count - 1));
      }
      showAppNotification(
        `Director count set to ${count}. Proceeding...`,
        "success",
        2000
      );
      setCurrentCard(FIRST_DIRECTOR_DETAIL_CARD_INDEX); // Move to the first detail card
    },
    [
      directorCount,
      directorsData,
      activeDirector,
      showAppNotification,
      isSaving,
    ] // Removed state setters, they are stable
  );

  const handleVisualSubTabClick = useCallback(
    async (targetSubPageId) => {
      if (isSaving) return;
      const director = directorsData[activeDirector];
      const targetStepIndex = directorFormSteps.findIndex(
        (step) => step.subPageId === targetSubPageId
      );
      if (targetStepIndex === -1) return;

      const targetCard = FIRST_DIRECTOR_DETAIL_CARD_INDEX + targetStepIndex;
      if (currentCard === targetCard) return; // Already on the target card/sub-tab

      // Prevent navigating to other tabs if 'Name' details are not saved yet (no dir_id)
      if (targetSubPageId !== "name" && (!director || !director.dir_id)) {
        showAppNotification(
          `Please complete and save 'Name' details for Director ${
            activeDirector + 1
          } first (using Save & Proceed).`,
          "warning"
        );
        return;
      }
      // Optionally, save current tab's data before switching sub-tabs visually
      // For simplicity, this example relies on "Save & Proceed" for explicit saves.
      // If auto-save on sub-tab click is desired, similar logic from handleSaveAndProceed could be added here.
      setCurrentCard(targetCard);
    },
    [currentCard, directorsData, activeDirector, showAppNotification, isSaving] // Removed setCurrentCard
  );

  const handleFileChange = useCallback(
    async (
      event,
      directorIdx,
      docTitle,
      directorTypeFromDocForm,
      serverDocKeyToStore
    ) => {
      const file = event.target.files[0];
      const localFileKey = `${directorIdx}-${directorTypeFromDocForm}-${docTitle}`;

      if (file) {
        setSelectedFiles((prev) => ({ ...prev, [localFileKey]: file }));
        const dir = directorsData[directorIdx];
        if (!dir || !dir.dir_id) {
          showAppNotification(
            `Save Director ${
              dir?.preferredFirstName || directorIdx + 1
            }'s 'Name' details first to enable document uploads.`,
            "warning"
          );
          setSelectedFiles((prev) => {
            const upd = { ...prev };
            delete upd[localFileKey];
            return upd;
          });
          if (event.target) event.target.value = null;
          return;
        }

        showAppNotification(
          `Uploading '${docTitle}' for ${
            dir.preferredFirstName || `Director ${directorIdx + 1}`
          }...`,
          "info",
          0
        ); // Indefinite

        try {
          const uploadResult = await uploadDirectorDocumentAPI({
            file,
            dirId: dir.dir_id,
            documentType: getApiDocumentTypeForUpload(
              docTitle,
              directorTypeFromDocForm
            ),
            orgId: ORG_ID,
          });

          if (
            uploadResult.status === "success" &&
            uploadResult.files &&
            uploadResult.files.length > 0
          ) {
            const filePath = uploadResult.files[0].path;
            showAppNotification(
              `'${docTitle}' uploaded successfully for ${
                dir.preferredFirstName || `Director ${directorIdx + 1}`
              }.`,
              "success"
            );

            setDirectorsData((prevData) => {
              const newData = [...prevData];
              if (newData[directorIdx]) {
                const updatedDirectorWithDoc = {
                  ...newData[directorIdx],
                  documents: {
                    ...newData[directorIdx].documents,
                    [serverDocKeyToStore]: filePath,
                  },
                };
                newData[directorIdx] = updatedDirectorWithDoc;

                // If this change affects the active director, update its snapshot
                if (directorIdx === activeDirector) {
                  setOriginalDirectorDataSnapshot(
                    JSON.parse(JSON.stringify(updatedDirectorWithDoc))
                  );
                }
              }
              return newData;
            });
            setSelectedFiles((prev) => {
              const upd = { ...prev };
              delete upd[localFileKey];
              return upd;
            });
          } else {
            showAppNotification(
              `Upload failed for '${docTitle}': ${
                uploadResult.message || "API error"
              }`,
              "error"
            );
            setSelectedFiles((prev) => {
              const upd = { ...prev };
              delete upd[localFileKey];
              return upd;
            }); // Clear on failure
          }
        } catch (error) {
          showAppNotification(
            `Upload error for '${docTitle}': ${
              error.message || "Network error"
            }`,
            "error"
          );
          setSelectedFiles((prev) => {
            const upd = { ...prev };
            delete upd[localFileKey];
            return upd;
          });
        }
      } else {
        // No file selected or file removed
        setSelectedFiles((prev) => {
          const upd = { ...prev };
          delete upd[localFileKey];
          return upd;
        });
      }
      if (event.target) event.target.value = null; // Reset file input
    },
    [directorsData, showAppNotification, ORG_ID, activeDirector] // Removed setDirectorsData, setSelectedFiles
  );

  const handleQrClick = useCallback(
    (
      directorIdx,
      docTitle,
      directorTypeFromDocForm,
      docId,
      serverDocKeyToStore
    ) => {
      const director = directorsData[directorIdx];
      if (!director || !director.dir_id) {
        showAppNotification(
          `Save Director ${
            director?.preferredFirstName || directorIdx + 1
          }'s 'Name' details first for QR code generation.`,
          "warning"
        );
        return;
      }
      setQrPopupData({
        directorIndex: directorIdx,
        dirId: director.dir_id,
        docTitle,
        directorType: directorTypeFromDocForm,
        docId,
        apiDocType: getApiDocumentTypeForUpload(
          docTitle,
          directorTypeFromDocForm
        ),
        serverDocKey: serverDocKeyToStore,
      });
      setShowQrPopup(true);
    },
    [directorsData, showAppNotification] // Removed setQrPopupData, setShowQrPopup
  );

  const closeQrPopup = useCallback(() => {
    setShowQrPopup(false);
    // setQrPopupData(null); // Optionally clear data
  }, []); // Removed setShowQrPopup

  const handleQrUploadComplete = useCallback(
    ({ directorIndex, serverDocKey, filePath, docTitle, directorType }) => {
      if (directorIndex !== undefined && serverDocKey && filePath) {
        showAppNotification(
          `Document '${docTitle}' received via QR upload.`,
          "success"
        );
        setDirectorsData((prevData) => {
          const newData = [...prevData];
          if (newData[directorIndex]) {
            const updatedDirectorWithDoc = {
              ...newData[directorIndex],
              documents: {
                ...newData[directorIndex].documents,
                [serverDocKey]: filePath,
              },
            };
            newData[directorIndex] = updatedDirectorWithDoc;

            if (directorIndex === activeDirector) {
              setOriginalDirectorDataSnapshot(
                JSON.parse(JSON.stringify(updatedDirectorWithDoc))
              );
            }
          }
          return newData;
        });
        const localFileKeyToClear = `${directorIndex}-${directorType}-${docTitle}`;
        setSelectedFiles((prev) => {
          const upd = { ...prev };
          delete upd[localFileKeyToClear];
          return upd;
        });
        closeQrPopup();
      } else {
        console.warn("QR Upload complete callback missing data.", {
          directorIndex,
          serverDocKey,
          filePath,
        });
        showAppNotification("QR upload processing error.", "error");
      }
    },
    [showAppNotification, closeQrPopup, activeDirector] // Removed setDirectorsData, setSelectedFiles
  );

  const addDirector = useCallback(async () => {
    if (isSaving) return;
    // Optional: Save current director's data before adding a new one
    // This example assumes users explicitly save via "Save & Proceed"

    if (directorsData.length < MAX_DIRECTORS) {
      const newDirectorIndex = directorsData.length;
      setDirectorsData((prevData) => [...prevData, { ...initialDirectorData }]);
      setDirectorCount(newDirectorIndex + 1);
      setActiveDirector(newDirectorIndex); // Switch to the new director
      setCurrentCard(FIRST_DIRECTOR_DETAIL_CARD_INDEX); // Start at the first form for the new director
      showAppNotification(
        `Added Director ${newDirectorIndex + 1}. Fill in their details.`,
        "info"
      );
    } else {
      showAppNotification(
        `Maximum of ${MAX_DIRECTORS} directors reached.`,
        "warning"
      );
    }
  }, [directorsData.length, showAppNotification, isSaving]); // Simplified dependencies
  const handleSaveAndExit = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    let canExit = true;
    let didAttemptSave = false;
    let saveSuccessful = true; // Assume success unless a save fails

    if (currentCard === DIRECTOR_COUNT_CARD_INDEX) {
      // No specific save action for the director count card itself when exiting.
    } else if (
      currentCard >= FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
      currentCard <= TOTAL_CARDS
    ) {
      const director = directorsData[activeDirector];
      const stepIndex = currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX;

      if (stepIndex < 0 || stepIndex >= directorFormSteps.length) {
        console.error("Invalid step index in handleSaveAndExit");
        setIsSaving(false);
        return;
      }
      const stepConfig = directorFormSteps[stepIndex];
      const dataChanged = hasDataChangedForCurrentStep();

      if (
        dataChanged ||
        (stepConfig.key === "name" && !director?.dir_id && director?.fullName)
      ) {
        didAttemptSave = true;
        if (stepConfig.key === "name") {
          if (
            !director.fullName ||
            !director.preferredFirstName ||
            !director.preferredLastName ||
            !director.fatherFirstName ||
            !director.fatherLastName
          ) {
            showAppNotification(
              "Name, Preferred First/Last Name, and Father's First/Last Name are required to save current step.",
              "warning"
            );
            canExit = false; // Prevent exit if validation fails for current step
            saveSuccessful = false;
          } else {
            const savedDirId = await directorSaveActions.saveName(
              activeDirector
            );
            if (!savedDirId) {
              canExit = true; // Allow exit even if save fails, but don't show "Data Saved"
              saveSuccessful = false;
            }
          }
        } else if (stepConfig.saveActionKey) {
          if (!director?.dir_id) {
            showAppNotification(
              `Cannot save ${stepConfig.title}: Director ${
                activeDirector + 1
              } ID missing. Save 'Name' details first. Current changes won't be saved.`,
              "warning"
            );
            canExit = true; // Allow exit, but data not saved
            saveSuccessful = false; // Explicitly mark as not saved successfully for this step
          } else {
            const stepSaveSuccess = await directorSaveActions[
              stepConfig.saveActionKey
            ](activeDirector);
            if (!stepSaveSuccess) {
              canExit = true; // Allow exit even if save fails
              saveSuccessful = false;
            }
          }
        }
      }
    }

    setIsSaving(false);

    if (canExit) {
      if (didAttemptSave && saveSuccessful) {
        showAppNotification(
          "Current step data saved. Exiting director setup...",
          "success",
          2000
        );
      } else if (didAttemptSave && !saveSuccessful) {
        showAppNotification(
          "Could not save pending changes for the current step. Exiting director setup...",
          "warning",
          2500
        );
      } else {
        showAppNotification("Exiting director setup...", "info", 1500);
      }
      setTimeout(
        () => {
          navigate("/NameReservation");
        },
        didAttemptSave ? 500 : 200
      );
    }
    // If canExit is false, it means a validation error prevented saving and exiting.
    // The specific error message would have been shown by the validation logic.
  }, [
    currentCard,
    directorsData,
    activeDirector,
    directorSaveActions,
    showAppNotification,
    navigate,
    isSaving,
    hasDataChangedForCurrentStep,
  ]);

  const removeDirector = useCallback(
    async (indexToRemove) => {
      if (isSaving) return;
      if (directorsData.length > MIN_DIRECTORS) {
        const directorBeingRemoved = directorsData[indexToRemove];
        const directorName =
          directorBeingRemoved.preferredFirstName ||
          `Director ${indexToRemove + 1}`;

        if (
          !window.confirm(
            `Are you sure you want to remove ${directorName}?` +
              (directorBeingRemoved.dir_id
                ? ` (This director has saved data (ID: ${directorBeingRemoved.dir_id}) which will NOT be deleted from the server by this action.)`
                : "")
          )
        ) {
          return;
        }

        if (directorBeingRemoved && directorBeingRemoved.dir_id) {
          showAppNotification(
            `Director ${directorName} (ID: ${directorBeingRemoved.dir_id}) removed from UI. Server data remains.`,
            "warning",
            5000
          );
        } else {
          showAppNotification(
            `Director ${directorName} removed from UI.`,
            "info"
          );
        }

        const newDirectorsData = directorsData.filter(
          (_, idx) => idx !== indexToRemove
        );
        setDirectorsData(newDirectorsData);
        setDirectorCount(newDirectorsData.length);

        // Re-index selectedFiles
        setSelectedFiles((prevFiles) => {
          const reIndexedFiles = {};
          Object.entries(prevFiles).forEach(([key, value]) => {
            const parts = key.split("-");
            if (parts.length >= 3) {
              // Expecting "directorIndex-directorType-docTitle"
              let dirIndexFromFile = parseInt(parts[0], 10);
              if (dirIndexFromFile === indexToRemove) return; // Skip files of removed director
              if (dirIndexFromFile > indexToRemove) dirIndexFromFile--; // Decrement index if it was after the removed one

              const fileDirectorType = parts[1];
              const fileDocTitle = parts.slice(2).join("-");
              reIndexedFiles[
                `${dirIndexFromFile}-${fileDirectorType}-${fileDocTitle}`
              ] = value;
            } else {
              reIndexedFiles[key] = value; // Preserve other keys if any (should not happen with current pattern)
            }
          });
          return reIndexedFiles;
        });

        // Adjust activeDirector if necessary
        if (activeDirector === indexToRemove) {
          setActiveDirector(Math.max(0, indexToRemove - 1)); // Go to previous or first
        } else if (activeDirector > indexToRemove) {
          setActiveDirector((prev) => prev - 1); // Adjust index
        }
        // Current card remains the same, new active director will load into it.
        // Snapshot for the new activeDirector will be updated by the useEffect for [activeDirector, currentCard]
      } else {
        showAppNotification(
          `Minimum of ${MIN_DIRECTORS} directors required.`,
          "warning"
        );
      }
    },
    [directorsData, activeDirector, showAppNotification, isSaving]
  ); // Simplified dependencies

  const handleDirectorTabClick = useCallback(
    async (indexToActivate) => {
      if (isSaving || activeDirector === indexToActivate) return;
      // Optional: Save current director's current form data before switching.
      // For simplicity, this relies on "Save & Proceed" or visual sub-tab click for saves.
      setActiveDirector(indexToActivate);
      // The useEffect for [activeDirector, currentCard] will handle snapshotting.
      // currentCard is not changed here, so user stays on the same form type for the new director.
    },
    [activeDirector, isSaving]
  ); // Simplified

  function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
  const currentDirector = directorsData[activeDirector] || initialDirectorData;

  const renderCardContent = () => {
    if (currentCard === DIRECTOR_COUNT_CARD_INDEX) {
      return (
        <form onSubmit={handleDirectorCountSubmit} className="text-center py-5">
          <div className="mb-4">
            <i
              className="bi bi-people mb-3"
              style={{
                fontSize: "3rem",
                background: "linear-gradient(135deg, #7353F6, #00c0ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
            <h4 className="mt-1 fw-semibold">
              {" "}
              How many directors will this company have?{" "}
            </h4>
            <p className="text-muted">
              {" "}
              Private Limited Companies require a minimum of {
                MIN_DIRECTORS
              }{" "}
              directors (Max: {MAX_DIRECTORS}).{" "}
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
            <div
              className="input-group"
              style={{ maxWidth: "300px", height: "55px" }}
            >
              <span className="input-group-text bg-light h-100 d-flex align-items-center justify-content-center">
                {" "}
                <i className="bi bi-people"></i>{" "}
              </span>
              <input
                type="number"
                className="form-control form-control-lg h-100"
                id="directorCountInput"
                min={MIN_DIRECTORS}
                max={MAX_DIRECTORS}
                value={directorCount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  // Allow empty input to be handled by MIN_DIRECTORS on submit, or restrict here
                  if (val >= MIN_DIRECTORS && val <= MAX_DIRECTORS)
                    setDirectorCount(val);
                  else if (e.target.value === "")
                    setDirectorCount(MIN_DIRECTORS); // Or handle empty state
                }}
                placeholder={`Min ${MIN_DIRECTORS} Directors`}
                required
                disabled={directorsData.some((d) => !!d.dir_id) || isSaving}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg px-4"
              style={{
                background: "linear-gradient(135deg, #7353F6, #00c0ff)",
                border: "none",
                boxShadow: "0 4px 10px rgba(0, 192, 255, 0.3)",
                height: "55px",
              }}
              disabled={isSaving || directorsData.some((d) => !!d.dir_id)} // Disable if count is locked
            >
              Continue <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
          {directorsData.some((d) => !!d.dir_id) && (
            <p className="text-warning mt-3 small">
              {" "}
              Director count locked. Use Add/Remove buttons.{" "}
            </p>
          )}
        </form>
      );
    }

    // Handling for director detail cards
    if (
      currentCard >= FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
      currentCard <= TOTAL_CARDS
    ) {
      // Show loader if isLoading is true AND we are on first detail card AND no snapshot yet (implies fetch not complete or initial state)
      if (
        isLoading &&
        currentCard === FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
        !originalDirectorDataSnapshot &&
        directorsData[activeDirector]
      ) {
        return (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              {" "}
              <span className="visually-hidden">Loading...</span>{" "}
            </div>
            <p className="mt-2">Loading director data...</p>
          </div>
        );
      }

      if (!currentDirector) {
        // Should ideally be caught by isLoading or directorsData.length check
        return (
          <div className="text-center p-5">
            Error: Director data not available. Please refresh.
          </div>
        );
      }
      if (directorsData.length === 0) {
        // Should not happen if MIN_DIRECTORS is enforced
        return (
          <div className="text-center p-5">
            Please set the number of directors first.
          </div>
        );
      }

      const stepIndex = currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX;
      if (stepIndex < 0 || stepIndex >= directorFormSteps.length) {
        return <div className="text-center p-5">Invalid form step.</div>; // Should not happen
      }
      const { FormComponent, subPageId: currentSubPageId } =
        directorFormSteps[stepIndex];

      return (
        <div className="px-2 py-3">
          <div className="director-tab-wrapper mb-3 d-flex align-items-center gap-2 flex-wrap">
            {directorsData.map((director, i) => (
              <div
                key={`director-tab-${i}`}
                className={`director-tab-item ${
                  activeDirector === i ? "active" : ""
                }`}
                onClick={() => handleDirectorTabClick(i)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleDirectorTabClick(i)
                }
              >
                <span className="tab-label">
                  {director.preferredFirstName
                    ? capitalizeFirst(director.preferredFirstName)
                    : `Director ${i + 1}`}
                </span>
                {directorsData.length > MIN_DIRECTORS && (
                  <span
                    className="tab-close"
                    title={`Remove Director ${
                      director.preferredFirstName || i + 1
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDirector(i);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      e.stopPropagation() &&
                      removeDirector(i)
                    }
                  >
                    {" "}
                    <i className="bi bi-x-lg"></i>{" "}
                  </span>
                )}
              </div>
            ))}
            {directorsData.length < MAX_DIRECTORS && (
              <div
                className="add-director-tab"
                onClick={addDirector}
                title="Add New Director"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && addDirector()}
              >
                {" "}
                <i className="bi bi-plus-lg"></i>{" "}
              </div>
            )}
          </div>

          <div className="sub-tabs d-flex gap-3 flex-wrap mb-4">
            {directorSubPageNavItems.map((tab) => (
              <div
                key={tab.id}
                className={`sub-tab ${
                  currentSubPageId === tab.id ? "active" : ""
                } ${
                  !currentDirector.dir_id && tab.id !== "name" ? "disabled" : ""
                }`}
                onClick={() => {
                  if (!currentDirector.dir_id && tab.id !== "name") {
                    showAppNotification(
                      `Please complete and save 'Name' details for Director ${
                        currentDirector.preferredFirstName || activeDirector + 1
                      } first.`,
                      "warning"
                    );
                    return;
                  }
                  handleVisualSubTabClick(tab.id);
                }}
                title={
                  !currentDirector.dir_id && tab.id !== "name"
                    ? `Save 'Name' details first to enable this tab`
                    : `Go to ${tab.label}`
                }
                role="button"
                tabIndex={!currentDirector.dir_id && tab.id !== "name" ? -1 : 0}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  !(!currentDirector.dir_id && tab.id !== "name") &&
                  handleVisualSubTabClick(tab.id)
                }
              >
                <div className="tab-icon-wrapper">
                  {" "}
                  <i className={`bi ${tab.icon}`}></i>{" "}
                </div>
                <span>{tab.label}</span>
              </div>
            ))}
          </div>

          <FormComponent
            data={currentDirector}
            onInputChange={handleDirectorInputChange}
            activeDirectorIndex={activeDirector} // Pass index if form needs it
            isSaving={isSaving} // Pass saving state for disabling inputs
            // Props specific to DirectorDocsForm
            selectedFiles={
              currentSubPageId === "docs" ? selectedFiles : undefined
            }
            handleFileChange={
              currentSubPageId === "docs" ? handleFileChange : undefined
            }
            handleQrClick={
              currentSubPageId === "docs" ? handleQrClick : undefined
            }
          />
        </div>
      );
    }
    return <div>Loading or unknown step...</div>; // Fallback
  };

  const cardTitle =
    currentCard === DIRECTOR_COUNT_CARD_INDEX
      ? "Director Information"
      : currentCard >= FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
        currentCard <= TOTAL_CARDS &&
        directorFormSteps[currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX] &&
        directorsData[activeDirector] // Ensure director data exists for title
      ? `${
          directorsData[activeDirector]?.preferredFirstName
            ? capitalizeFirst(directorsData[activeDirector].preferredFirstName)
            : activeDirector + 1
        } - ${
          directorFormSteps[currentCard - FIRST_DIRECTOR_DETAIL_CARD_INDEX]
            .title
        }`
      : "Director Details";

  if (isLoading && currentCard === DIRECTOR_COUNT_CARD_INDEX && ORG_ID) {
    // Only show full page loader if ORG_ID exists meaning fetch is pending
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification.visible && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            padding: "12px 20px",
            backgroundColor:
              notification.type === "success"
                ? "#d1e7dd"
                : notification.type === "error"
                ? "#f8d7da"
                : notification.type === "warning"
                ? "#fff3cd"
                : "#cfe2ff",
            color:
              notification.type === "success"
                ? "#0a3622"
                : notification.type === "error"
                ? "#58151c"
                : notification.type === "warning"
                ? "#664d03"
                : "#052c65",
            border: `1px solid ${
              notification.type === "success"
                ? "#badbcc"
                : notification.type === "error"
                ? "#f1aeb5"
                : notification.type === "warning"
                ? "#ffecb5"
                : "#a6c5f0"
            }`,
            borderRadius: "8px",
            zIndex: 2000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "0.95rem",
            maxWidth: "400px",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: notification.visible ? 1 : 0,
            transform: notification.visible
              ? "translateY(0)"
              : "translateY(-20px)",
          }}
        >
          {notification.message}
          <button
            onClick={() =>
              setNotification((prev) => ({ ...prev, visible: false }))
            }
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              marginLeft: "15px",
              cursor: "pointer",
              float: "right",
              fontSize: "1.1rem",
              lineHeight: "1",
            }}
            aria-label="Close notification"
          >
            {" "}
            ×{" "}
          </button>
        </div>
      )}
      <CardLayout
        title={cardTitle}
        currentCard={currentCard}
        totalCards={TOTAL_CARDS} // Use calculated TOTAL_CARDS
        onNext={handleSaveAndProceed}
        onPrev={handlePrev}
        onPageChange={(page) => {
          // This is CardLayout's direct page change via progress bar etc.
          if (isSaving) return;
          const targetStepIndex = page - FIRST_DIRECTOR_DETAIL_CARD_INDEX;
          const director = directorsData[activeDirector];

          // If trying to jump to a step beyond 'name' without dir_id
          if (
            page > FIRST_DIRECTOR_DETAIL_CARD_INDEX && // Target page is beyond name step
            targetStepIndex >= 0 &&
            targetStepIndex < directorFormSteps.length &&
            directorFormSteps[targetStepIndex].subPageId !== "name" &&
            (!director || !director.dir_id)
          ) {
            showAppNotification(
              "Please complete and save 'Name' details first (using Save & Proceed) before jumping to other steps.",
              "warning"
            );
            return; // Prevent jump
          }
          setCurrentCard(page);
        }}
        onFinalSubmit={handleSaveAndProceed}
        isNextDisabled={
          isSaving ||
          (currentCard === DIRECTOR_COUNT_CARD_INDEX &&
            directorsData.some((d) => d.dir_id))
        } // Disable director count continue if data exists
        isPrevDisabled={
          isSaving ||
          currentCard === DIRECTOR_COUNT_CARD_INDEX || // Cannot go back from director count card
          (currentCard === FIRST_DIRECTOR_DETAIL_CARD_INDEX &&
            activeDirector === 0)
        }
        showSaveExitButton={true}
        onSaveExitClick={handleSaveAndExit}
        isSaveExitDisabled={isSaving}
        saveExitButtonText="Save & Exit"
      >
        {renderCardContent()}
      </CardLayout>
      <QrCodePopup
        isOpen={showQrPopup}
        onClose={closeQrPopup}
        data={qrPopupData}
        onUploadComplete={handleQrUploadComplete}
      />
    </>
  );
}
