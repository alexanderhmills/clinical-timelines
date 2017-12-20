import arrayOfVariablesCheck from './arrayOfVariablesCheck';
import '../../util/number-isinteger';

export default function syncRendererSpecificSettings(settings) {
    //ID
    settings.id_unitPropCased =
        settings.id_unit.substring(0, 1).toUpperCase() +
        settings.id_unit.substring(1).toLowerCase();
    const defaultID_characteristics = [
        { value_col: settings.id_col, label: settings.id_unitPropCased }
    ];
    settings.id_characteristics = arrayOfVariablesCheck(
        defaultID_characteristics,
        settings.id_characteristics
    );

    //Events
    if (!(settings.event_types instanceof Array && settings.event_types.length))
        delete settings.event_types;

    //Filters
    const defaultFilters = [
        { value_col: settings.id_col, label: settings.id_unitPropCased },
        { value_col: settings.event_col, label: 'Event Type' }
    ];
    if (settings.ongo_col)
        defaultFilters.splice(2, 0, { value_col: settings.ongo_col, label: 'Ongoing?' });
    settings.filters = arrayOfVariablesCheck(defaultFilters, settings.filters);

    //Groupings
    const defaultGroupings = [];
    settings.groupings = arrayOfVariablesCheck(defaultGroupings, settings.groupings);
    if (['horizontal', 'vertical'].indexOf(settings.grouping_direction) === -1)
        settings.grouping_direction = 'horizontal';

    //Reference lines
    if (settings.reference_lines) {
        if (!(settings.reference_lines instanceof Array))
            settings.reference_lines = [settings.reference_lines];

        settings.reference_lines = settings.reference_lines
            .map(reference_line => {
                const referenceLineObject = {};
                referenceLineObject.timepoint = reference_line.timepoint || reference_line;
                referenceLineObject.label =
                    reference_line.label ||
                    `${settings.time_scale}: ${referenceLineObject.timepoint}`;

                return referenceLineObject;
            })
            .filter(reference_line => Number.isInteger(+reference_line.timepoint));

        if (!settings.reference_lines.length) delete settings.reference_lines;
    }

    //Details
    const defaultDetails =
        settings.time_scale === 'Study Day'
            ? [
                  { value_col: settings.event_col, label: 'Event Type' },
                  { value_col: settings.stdy_col, label: 'Start Day' },
                  { value_col: settings.endy_col, label: 'Stop Day' },
                  { value_col: settings.seq_col, label: 'Sequence Number' }
              ]
            : [
                  { value_col: settings.event_col, label: 'Event Type' },
                  { value_col: settings.stdt_col, label: 'Start Date' },
                  { value_col: settings.endt_col, label: 'Stop Date' },
                  { value_col: settings.seq_col, label: 'Sequence Number' }
              ];
    settings.details = arrayOfVariablesCheck(defaultDetails, settings.details);
    settings.filters.forEach(filter => {
        if (settings.details.map(detail => detail.value_col).indexOf(filter.value_col) === -1)
            settings.details.push(filter);
    });
}