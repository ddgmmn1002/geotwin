import csv

valid_count = 0
rejected_count = 0

with (
    open( "data/서울시 소방용수시설 현황.csv", encoding="cp949", errors="replace", newline="") as source_data_file,
    open("data/facilities_valid.csv", "w", encoding="utf-8-sig", newline="") as valid_data_file,
    open("data/facilities_rejected.csv", "w", encoding="utf-8-sig", newline="") as rejected_data_file
):
    reader = csv.DictReader(source_data_file)
    columns = reader.fieldnames

    valid_writer = csv.DictWriter(valid_data_file, fieldnames=columns)
    rejected_writer = csv.DictWriter(
        rejected_data_file, 
        fieldnames=[*columns, "제외사유"],
    )

    valid_writer.writeheader()
    rejected_writer.writeheader()

    for row in reader:
        rejection_reason = None
        try:
            lat = float(row["위도"].strip())
            lon = float(row["경도"].strip())
        except (ValueError, TypeError):
            rejection_reason= "좌표 누락 또는 형식 오류"
        else:
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                rejection_reason= "좌표 범위 초과"

        if rejection_reason is not None:
            row["제외사유"] = rejection_reason
            rejected_writer.writerow(row)
            rejected_count += 1
            continue

        for key, value in row.items():
            if isinstance(value, str):
                row[key] = value.strip()

        valid_writer.writerow(row)
        valid_count += 1

print("제외건수: ", rejected_count)
print("저장건수: ", valid_count)