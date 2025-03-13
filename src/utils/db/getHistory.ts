import { dataType } from "./../../views-open-args";

export const getHistory = (): dataType[] => {
    return [
        {
            id: 3,
            email: "kondo.daisuke@agileware.jp",
            usageDate: new Date("2025-03-13T00:00:00.000Z"),
            createdAt: new Date("2025-03-13T02:34:14.360Z"),
            departureLocation: "天王寺",
            targetLocation: "天満橋",
            type: 1,
            note: "オフィス出社",
            expense: 300,
        },
        {
            id: 4,
            email: "kondo.daisuke@agileware.jp",
            usageDate: new Date("2025-03-15T00:00:00.000Z"),
            createdAt: new Date("2025-03-15T02:34:14.360Z"),
            departureLocation: "天王寺",
            targetLocation: "天満橋",
            type: 1,
            note: "オフィス出社",
            expense: 300,
        },
    ];
};
