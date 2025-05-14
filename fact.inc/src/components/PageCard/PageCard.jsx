import React, { useState, useEffect } from "react";
import "./PageCard.css";
import MagicFillButton from "./MagicFillButton";

const generatePaginationItems = (currentPage, totalPages, siblingCount = 1) => {
  const totalNumbers = siblingCount * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages <= totalBlocks - siblingCount) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
  const firstPageIndex = 1;
  const lastPageIndex = totalPages;
  let items = [];
  items.push(firstPageIndex);
  if (shouldShowLeftDots) {
    items.push("...");
  }
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (
      i === firstPageIndex &&
      !shouldShowLeftDots &&
      i + 1 <= rightSiblingIndex
    ) {
      if (!items.includes(i + 1)) items.push(i + 1);
    } else if (
      i === lastPageIndex &&
      !shouldShowRightDots &&
      i - 1 >= leftSiblingIndex
    ) {
      if (!items.includes(i - 1)) items.push(i - 1);
    } else if (i !== firstPageIndex && i !== lastPageIndex) {
      if (!items.includes(i)) items.push(i);
    }
  }
  items = [...new Set(items)];
  const first = items.shift();
  const maybeLast =
    items[items.length - 1] === lastPageIndex ? items.pop() : null;
  items.sort((a, b) => (a === "..." || b === "..." ? 0 : a - b));
  items.unshift(first);
  if (maybeLast) items.push(maybeLast);

  if (shouldShowRightDots) {
    if (
      items[items.length - 1] !== "..." &&
      items[items.length - 1] < lastPageIndex - 1
    ) {
      items.push("...");
    }
  }

  if (totalPages > 1 && !items.includes(lastPageIndex)) {
    items.push(lastPageIndex);
  }

  if (items[1] === "..." && items[2] === 2) items.splice(1, 1);
  if (
    items[items.length - 2] === "..." &&
    items[items.length - 3] === totalPages - 1
  )
    items.splice(items.length - 2, 1);

  return items;
};

function PageCard({
  title,
  currentCard,
  totalCards,
  children,
  onNext,
  onPrev,
  onSubmit,
  onFinalSubmit,
  onPageChange,
  setFormData,
  exampleData,
  subPageItems,
  activeSubPageId,
  onSubPageChange,
  showSubPagesOnCard,
  showSaveExitButton,
  onSaveExitClick,
  isSaveExitDisabled,
  saveExitButtonText,
  isNextDisabled,
  isPrevDisabled,
}) {
  const isLastCard = currentCard === totalCards;
  const [goToPageInput, setGoToPageInput] = useState("");

  useEffect(() => {
    setGoToPageInput("");
  }, [currentCard]);

  const handleProceed = () => {
    if (isLastCard) {
      onFinalSubmit?.();
    } else {
      onNext?.();
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setGoToPageInput(value);
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const pageNumber = parseInt(goToPageInput, 10);
      if (
        !isNaN(pageNumber) &&
        pageNumber >= 1 &&
        pageNumber <= totalCards &&
        pageNumber !== currentCard
      ) {
        onPageChange(pageNumber);
      } else {
        if (goToPageInput !== "") {
          setGoToPageInput("");
        }
      }
    }
  };

  const renderPaginationControls = () => {
    const paginationItems = generatePaginationItems(currentCard, totalCards);
    return (
      <div className="modern-pagination-controls">
        {paginationItems.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }
          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`pagination-item ${
                item === currentCard ? "active" : ""
              }`}
              disabled={item === currentCard}
              aria-label={`Go to page ${item}`}
              aria-current={item === currentCard ? "page" : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page-card animate-fade-in">
      <div className="page-card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0 flex-grow-1">{title}</h5>
        <div className="d-flex align-items-center gap-3">
          {setFormData && exampleData && (
            <MagicFillButton setFormData={setFormData} data={exampleData} />
          )}
          {currentCard && totalCards && totalCards > 1 && (
            <span className="card-step-indicator">
              Page {currentCard} / {totalCards}
            </span>
          )}
        </div>
      </div>

      <div className="page-card-body">{children}</div>

      <div className="navigation-divider"></div>

      <div className="navigation-area">
        <div className="navigation-buttons">
          <div className="navigation-buttons-left">
            {currentCard > 1 && (
              <button
                className="btn-prev"
                onClick={onPrev}
                disabled={isPrevDisabled}
              >
                <i className="bi bi-arrow-left me-2"></i> Previous
              </button>
            )}
            {currentCard <= 1 && (
              <div style={{ minWidth: "120px", visibility: "hidden" }}></div>
            )}
          </div>

          <div className="navigation-buttons-center">
            <div className="pagination-center-content">
              {totalCards > 1 && onPageChange && renderPaginationControls()}
              {currentCard === showSubPagesOnCard &&
                subPageItems &&
                subPageItems.length > 0 &&
                onSubPageChange && (
                  <div className="sub-page-navigation">
                    {subPageItems.map((subPage) => (
                      <button
                        key={subPage.id}
                        type="button"
                        className={`sub-page-item ${
                          subPage.id === activeSubPageId ? "active" : ""
                        }`}
                        onClick={() => onSubPageChange(subPage.id)}
                        title={subPage.label}
                      >
                        {subPage.icon && (
                          <i className={`bi ${subPage.icon} me-1`}></i>
                        )}
                        {subPage.label}
                      </button>
                    ))}
                  </div>
                )}

              {totalCards > 1 && totalCards > 5 && onPageChange && (
                <div className="pagination-goto-container">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="pagination-goto-input"
                    placeholder="Go to..."
                    value={goToPageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    aria-label={`Go to page number (1-${totalCards})`}
                    maxLength={String(totalCards).length}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="navigation-buttons-right">
            {showSaveExitButton && (
              <button
                className="btn-save-exit"
                onClick={onSaveExitClick}
                disabled={isSaveExitDisabled}
              >
                <i className="bi bi-box-arrow-left me-2"></i>
                {saveExitButtonText || "Save & Exit"}
              </button>
            )}
            <button
              className="modern-submit-btn"
              onClick={handleProceed}
              disabled={isNextDisabled}
            >
              {isLastCard ? "Save & Proceed" : "Save & Proceed"}{" "}
              {isLastCard ? (
                <i className="bi bi-check-circle-fill ms-2"></i>
              ) : (
                <i className="bi bi-arrow-right-circle ms-2"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageCard;
