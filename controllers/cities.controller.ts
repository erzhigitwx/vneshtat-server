import { db } from "../database/index.js";
import { Request, Response } from "express";
import Fuse from "fuse.js";

class CitiesController {
    async searchCities(req, res) {
        try {
            const query = req.query.query;
            if (!query) {
                return res.status(400).send({ error: "Query parameter is required" });
            }

            const [rows]: any[] = await db.execute(
                "SELECT * FROM cities WHERE NameRu LIKE ? OR NameEn LIKE ?",
                [`%${query}%`, `%${query}%`]
            );

            const cities = rows.map(row => ({
                nameRu: row.NameRu,
                nameEn: row.NameEn,
                ...row
            }));

            const fuse = new Fuse(cities, {
                keys: ["nameRu", "nameEn"],
                includeScore: true,
                threshold: 0.4, // Increase threshold for more fuzziness
                distance: 200,  // Increase distance to handle typos better
                useExtendedSearch: true
            });

            const result = fuse.search(query).slice(0, 6);

            res.status(200).send({ data: result.map(r => r.item) });
        } catch (e) {
            console.error("Database query error:", e);
            res.status(500).send({ error: "Database query error" });
        }
    }
}

const citiesController = new CitiesController();
export default citiesController;
