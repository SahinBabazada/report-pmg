import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import Modal from 'react-modal';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './DateRangePickerComponent.css';

const DateRangePickerComponent = ({ onChange }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    onChange(ranges.selection);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="date-range-picker-wrapper">
      <button onClick={openModal} className="date-range-open-modal-button">Select Date Range</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Date Range Picker"
        className="date-range-modal"
        overlayClassName="date-range-overlay"
      >
        <div className="date-range-modal-content">
          <DateRangePicker
            ranges={range}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            className="date-range-picker"
          />
          <button onClick={closeModal} className="date-range-close-modal-button">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default DateRangePickerComponent;
