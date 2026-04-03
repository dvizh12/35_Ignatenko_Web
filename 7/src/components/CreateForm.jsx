import { useState } from "react";

export default function CreateForm({ fields, onSubmit }) {
  const [form, setForm] = useState({});

  return (
    <div className="form-card">
      {Object.keys(fields).map(key => (
        <div className="form-group" key={key}>
          <label>{fields[key]}</label>

          {key === "completed" ? (
            <select onChange={(e) =>
              setForm({ ...form, [key]: e.target.value === "true" })
            }>
              <option value="false">Не выполнено</option>
              <option value="true">Выполнено</option>
            </select>
          ) : (
            <input
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          )}
        </div>
      ))}

      <button className="primary-btn" onClick={() => onSubmit(form)}>
        Создать
      </button>
    </div>
  );
}
