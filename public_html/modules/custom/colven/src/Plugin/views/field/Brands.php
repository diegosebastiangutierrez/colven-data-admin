<?php

namespace Drupal\colven\Plugin\views\field;

use Drupal\views\ResultRow;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Serialization\Json;

/**
 * Field handler to output brands in JSON format.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("brands")
 */
class Brands extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values) {
    $entity = $values->_entity;
    if (isset($entity->brands) && !empty($entity->brands)) {

      return Json::encode($entity->brands);
    }
    return [];
  }



  /**
   * {@inheritdoc}
   */
  public function query() {
    // Do not query anything for this field.
    $this->addAdditionalFields();
  }

  /**
   * {@inheritdoc}
   */
  public function addAdditionalFields($fields = NULL) {
    // Add any additional fields required.
  }
}

